# Firebase setup

The app uses Cloud Firestore for the newsletter and booking forms.

## 1. Create a Firebase project

1. Open the [Firebase Console](https://console.firebase.google.com/).
2. Create or select a project.
3. Add a Web app from Project settings.
4. Copy the Firebase config values into a new `.env` file in this project, using `.env.example` as the template.

Firebase web configuration values are safe to include in a frontend build. Keep admin credentials and service-account JSON files out of the frontend.

## 2. Enable Firestore

Create a Cloud Firestore database in production mode, then create these collections by submitting the forms:

- `newsletter_subscribers`: `email` (string), `createdAt` (timestamp)
- `booking_requests`: `destination`, `travelDate`, `guests`, `fullName`, `phone`, `email`, `notes`, `createdAt`

## 3. Firestore rules

Use rules that allow public form creation but prevent visitors from reading, editing, or deleting submissions:

```text
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /newsletter_subscribers/{document} {
      allow create: if request.resource.data.email is string
        && request.resource.data.email.matches('^.+@.+\\\\..+$');
      allow read, update, delete: if false;
    }

    match /booking_requests/{document} {
      allow create: if request.resource.data.destination is string
        && request.resource.data.travelDate is string
        && request.resource.data.guests is number
        && request.resource.data.guests >= 1
        && request.resource.data.fullName is string
        && request.resource.data.phone is string
        && request.resource.data.email is string;
      allow read, update, delete: if false;
    }
  }
}
```

## 4. Run the app

```powershell
npm install
npm run dev
```
