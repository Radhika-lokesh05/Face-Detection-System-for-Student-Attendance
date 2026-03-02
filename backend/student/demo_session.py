# student/demo_session.py - OPTIMIZED VERSION
from flask import Blueprint, request, jsonify, current_app
import time
import base64
import numpy as np
from PIL import Image
import io
from deepface import DeepFace
from scipy.spatial.distance import cosine
import logging
import threading

logger = logging.getLogger(__name__)

demo_session_bp = Blueprint("demo_session", __name__)

def read_image_from_bytes_optimized(b, target_size=(640, 480)):
    """Optimized image reading with size constraints"""
    img = Image.open(io.BytesIO(b)).convert("RGB")

    # Resize large images to reduce processing time
    if img.width > target_size[0] or img.height > target_size[1]:
        img.thumbnail(target_size, Image.Resampling.LANCZOS)

    return np.array(img)

def detect_faces_rgb_optimized(rgb_image, detector):
    """Optimized face detection using preloaded MTCNN detector"""
    # Skip detection if image is too small
    if rgb_image.shape[0] < 50 or rgb_image.shape[1] < 50:
        return []

    detections = detector.detect_faces(rgb_image)
    faces = []

    for d in detections:
        if d["confidence"] > 0.85:  # Slightly lower threshold for speed
            x, y, w, h = d["box"]
            x, y = max(0, x), max(0, y)
            if w > 40 and h > 40:  # Filter small faces
                face_rgb = rgb_image[y:y+h, x:x+w]
                faces.append({
                    "box": (x, y, w, h), 
                    "face": face_rgb, 
                    "confidence": d["confidence"]
                })

    return faces

def extract_embedding_optimized(face_rgb):
    """Optimized embedding extraction using preloaded model"""
    try:
        # Resize face to standard size
        face_pil = Image.fromarray(face_rgb.astype("uint8")).resize((160, 160))
        face_array = np.array(face_pil)

        # Use DeepFace with optimized parameters
        rep = DeepFace.represent(
            face_array, 
            model_name="Facenet512", 
            detector_backend="skip",
            enforce_detection=False  # Skip additional detection
        )
        return np.array(rep[0]["embedding"], dtype=np.float32)  # Use float32 for speed

    except Exception as e:
        logger.error(f"Embedding extraction error: {e}")
        return None

# In-memory cache for student embeddings (optional optimization)
class EmbeddingCache:
    def __init__(self):
        self.student_embeddings = None
        self.last_update = 0
        self.cache_duration = 300  # 5 minutes
        self.lock = threading.Lock()

    def get_embeddings(self, students_col):
        current_time = time.time()

        # Thread-safe cache check
        with self.lock:
            if (self.student_embeddings is None or 
                current_time - self.last_update > self.cache_duration):

                logger.info("Refreshing embedding cache...")

                # Fetch students with embeddings
                students = list(students_col.find(
                    {"embeddings": {"$exists": True, "$ne": None}},
                    {"studentId": 1, "studentName": 1, "embeddings": 1}
                ))

                # Process embeddings
                self.student_embeddings = []
                for student in students:
                    embeddings = student.get('embeddings', [])
                    if embeddings:
                        # Average multiple embeddings if available
                        avg_embedding = np.mean(embeddings, axis=0).astype(np.float32)
                        self.student_embeddings.append({
                            'embedding': avg_embedding,
                            'studentId': student.get('studentId'),
                            'studentName': student.get('studentName')
                        })

                self.last_update = current_time
                logger.info(f"Cache refreshed with {len(self.student_embeddings)} students")

        return self.student_embeddings

# Global embedding cache instance
embedding_cache = EmbeddingCache()

def find_best_match_optimized(query_embedding, students_col, threshold=0.6):
    """Optimized database search with caching"""
    cached_embeddings = embedding_cache.get_embeddings(students_col)

    if not cached_embeddings:
        return None, float('inf')

    best_match = None
    min_distance = float('inf')

    # Vectorized comparison for speed
    for student_data in cached_embeddings:
        stored_embedding = student_data['embedding']
        distance = cosine(query_embedding, stored_embedding)

        if distance < min_distance:
            min_distance = distance
            best_match = student_data

    return best_match if min_distance < threshold else None, min_distance

@demo_session_bp.route("/api/demo/recognize", methods=["POST"])
def demo_recognize_optimized():
    """OPTIMIZED face recognition endpoint using preloaded models"""
    start_time = time.time()

    # Get model manager from Flask config
    model_manager = current_app.config.get("MODEL_MANAGER")
    if not model_manager or not model_manager.is_ready():
        logger.error("Models not ready")
        return jsonify({
            "success": False, 
            "error": "Face recognition models not initialized"
        }), 503

    # Get preloaded detector
    detector = model_manager.get_detector()

    data = request.get_json()
    db = current_app.config.get("DB")
    students_col = db.students
    threshold = float(current_app.config.get("THRESHOLD", "0.6"))

    image_b64 = data.get("image", "")
    if image_b64.startswith("data:"):
        image_b64 = image_b64.split(",", 1)[1]

    try:
        # Optimized image processing
        rgb = read_image_from_bytes_optimized(base64.b64decode(image_b64))
    except Exception as e:
        logger.error(f"Image processing error: {e}")
        return jsonify({"success": False, "error": "Invalid base64 image"}), 400

    # Face detection with timing
    detection_start = time.time()
    faces = detect_faces_rgb_optimized(rgb, detector)
    detection_time = time.time() - detection_start

    if len(faces) == 0:
        return jsonify({
            "success": True, 
            "faces": [],
            "processing_time": round(time.time() - start_time, 3),
            "detection_time": round(detection_time, 3)
        })

    results = []

    # Process each detected face
    for f in faces:
        embedding_start = time.time()
        emb = extract_embedding_optimized(f["face"])
        embedding_time = time.time() - embedding_start

        if emb is None:
            results.append({
                "match": None, 
                "distance": None, 
                "box": f["box"],
                "error": "Failed to extract embedding"
            })
            continue

        # Search for best match with timing
        search_start = time.time()
        best_match, min_distance = find_best_match_optimized(emb, students_col, threshold)
        search_time = time.time() - search_start

        if best_match:
            results.append({
                "match": {
                    "user_id": best_match["studentId"], 
                    "name": best_match["studentName"]
                },
                "distance": round(float(min_distance), 4),
                "confidence": round((1 - min_distance) * 100, 1),
                "box": f["box"],
                "timing": {
                    "embedding": round(embedding_time, 3),
                    "search": round(search_time, 3)
                }
            })
        else:
            results.append({
                "match": None, 
                "distance": round(float(min_distance), 4), 
                "box": f["box"],
                "timing": {
                    "embedding": round(embedding_time, 3),
                    "search": round(search_time, 3)
                }
            })

    total_time = time.time() - start_time

    return jsonify({
        "success": True, 
        "faces": results, 
        "processing_time": round(total_time, 3),
        "detailed_timing": {
            "detection": round(detection_time, 3),
            "total": round(total_time, 3)
        },
        "performance_info": {
            "models_preloaded": True,
            "cache_enabled": True
        }
    })

@demo_session_bp.route('/api/demo/session', methods=['POST'])
def create_demo_session():
    """Create a new demo session"""
    db = current_app.config.get("DB")
    demo_sessions_col = db.demo_sessions

    session_data = {
        "session_id": f"demo_{int(time.time())}",
        "started_at": time.time(),
        "status": "active",
        "recognitions": []
    }

    result = demo_sessions_col.insert_one(session_data)
    session_data['_id'] = str(result.inserted_id)

    return jsonify({
        "success": True,
        "session": session_data
    })

@demo_session_bp.route('/api/demo/session/<session_id>/log', methods=['POST'])
def log_recognition(session_id):
    """Log recognition result to session"""
    db = current_app.config.get("DB")
    demo_sessions_col = db.demo_sessions

    data = request.get_json()
    recognition_log = {
        "timestamp": time.time(),
        "result": data.get('result'),
        "confidence": data.get('confidence'),
        "processing_time": data.get('processing_time')
    }

    demo_sessions_col.update_one(
        {"session_id": session_id},
        {"$push": {"recognitions": recognition_log}}
    )

    return jsonify({"success": True, "message": "Recognition logged"})

@demo_session_bp.route('/api/demo/models/status', methods=['GET'])
def model_status():
    """Check model status endpoint"""
    model_manager = current_app.config.get("MODEL_MANAGER")

    if not model_manager:
        return jsonify({
            "success": False,
            "error": "Model manager not available"
        }), 500

    return jsonify({
        "success": True,
        "models_ready": model_manager.is_ready(),
        "health_check": model_manager.health_check(),
        "timestamp": time.time()
    })