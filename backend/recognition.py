import cv2
from mtcnn import MTCNN
from deepface import DeepFace
from pymongo import MongoClient
from scipy.spatial.distance import cosine
import numpy as np
import time

# ----------------- MongoDB Setup -----------------
MONGODB_URI = "mongodb+srv://Kamlesh-21:Guru2004@attendencesystem.nlapsic.mongodb.net/Attendencesystem?retryWrites=true&w=majority&appName=Attendencesystem"
client = MongoClient(MONGODB_URI)
db = client['facerecognition_db']
collection = db['users']

# ----------------- Face Detector -----------------
detector = MTCNN()

# ----------------- Detect Faces -----------------
def detect_faces(image):
    rgb_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    faces = detector.detect_faces(rgb_image)
    face_data = []
    for face in faces:
        x, y, w, h = face['box']
        x, y = max(0, x), max(0, y)
        face_img = rgb_image[y:y+h, x:x+w]
        face_data.append({'box': (x, y, w, h), 'face': face_img})
    return face_data

# ----------------- Extract Embedding -----------------
def extract_embedding(face_img):
    try:
        embedding = DeepFace.represent(face_img, model_name='Facenet512', detector_backend='skip')
        return embedding[0]['embedding']
    except Exception as e:
        print("Error extracting embedding:", e)
        return None

# ----------------- Automatic Registration -----------------
def auto_register_user(user_id, name, wait_time=5):
    """
    Automatically captures a face from webcam and registers user.
    wait_time: Seconds to wait before registering (to stabilize face).
    """
    cap = cv2.VideoCapture(0)
    cap.set(cv2.CAP_PROP_FRAME_WIDTH, 1280)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 720)
    print(f"Looking for {name}'s face. Please look at the camera for {wait_time} seconds...")

    start_time = time.time()
    registered = False

    while True:
        ret, frame = cap.read()
        if not ret:
            print("Failed to capture frame.")
            break

        faces = detect_faces(frame)
        if len(faces) == 1:
            x, y, w, h = faces[0]['box']
            cv2.rectangle(frame, (x, y), (x+w, y+h), (0, 255, 0), 2)
            cv2.putText(frame, "Face detected", (x, y-10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 255, 0), 2)
            if time.time() - start_time > wait_time:
                embedding = extract_embedding(faces[0]['face'])
                if embedding is not None:
                    user_data = {
                        'user_id': user_id,
                        'name': name,
                        'embedding': embedding.tolist() if isinstance(embedding, np.ndarray) else embedding
                    }
                    collection.insert_one(user_data)
                    print(f"User {name} registered successfully.")
                    registered = True
                    break
        else:
            cv2.putText(frame, f"{len(faces)} faces detected. Show only one face.", (50,50),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0,0,255), 2)
            start_time = time.time()  # Reset timer if face not stable

        cv2.imshow("Automatic Registration", frame)
        key = cv2.waitKey(1) & 0xFF
        if key == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()
    if not registered:
        print("Registration failed. Please try again.")

# ----------------- Live Recognition -----------------
def live_recognition():
    users = list(collection.find())
    if not users:
        print("No users registered.")
        return

    threshold = 0.7  # Cosine similarity threshold

    cap = cv2.VideoCapture(0)
    cap.set(cv2.CAP_PROP_FRAME_WIDTH, 1280)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 720)
    print("Starting live recognition. Press 'q' to quit.")

    while True:
        ret, frame = cap.read()
        if not ret:
            print("Failed to capture frame.")
            break

        faces = detect_faces(frame)

        for face_data in faces:
            x, y, w, h = face_data['box']
            face_img = face_data['face']
            embedding = extract_embedding(face_img)
            if embedding is None:
                continue

            best_match = None
            min_distance = float('inf')

            for user in users:
                stored_embedding = user['embedding']
                distance = cosine(embedding, stored_embedding)
                if distance < min_distance:
                    min_distance = distance
                    best_match = user

            if min_distance < threshold:
                name_text = f"{best_match['name']} ({min_distance:.2f})"
                color = (0, 255, 0)  # Green for known
            else:
                name_text = "Unknown"
                color = (0, 0, 255)  # Red for unknown

            cv2.rectangle(frame, (x, y), (x+w, y+h), color, 2)
            cv2.putText(frame, name_text, (x, y-10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, color, 2)

        cv2.imshow("Live Recognition", frame)
        key = cv2.waitKey(1) & 0xFF
        if key == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()

# ----------------- Main Menu -----------------
def main():
    while True:
        print("\nFace Recognition System")
        print("1. Automatic Register User")
        print("2. Start Live Recognition")
        print("3. Exit")
        choice = input("Enter your choice: ")

        if choice == '1':
            user_id = input("Enter user ID: ")
            name = input("Enter user name: ")
            auto_register_user(user_id, name)
        elif choice == '2':
            live_recognition()
        elif choice == '3':
            break
        else:
            print("Invalid choice. Try again.")

if __name__ == "__main__":
    main()
