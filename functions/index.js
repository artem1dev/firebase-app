const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

exports.contacts = functions.https.onRequest(async (req, res) => {
    const name = req.query.name;
    const phone = req.query.phone;

    const addContact = await admin.firestore().collection("contacts").add({
        name: name,
        phone: phone,
    });

    res.json({ wtf: `${addContact.id}` });
});

exports.addDate = functions.firestore.document("contacts/{contactId}").onCreate((snapshot, context) => {
    const timestamp = admin.firestore.FieldValue.serverTimestamp();

    return admin.firestore().doc(`contacts/${context.params.contactId}`).update({
        dateAdded: timestamp,
    });
});

exports.addLog = functions.https.onCall(async (data, context) => {
    const log = {
        message: data.message,
        time: admin.firestore.FieldValue.serverTimestamp(),
    };

    const addLog = await admin.firestore().collection("logs").add(log);
    return `awesome2:${addLog.id}`;
});
