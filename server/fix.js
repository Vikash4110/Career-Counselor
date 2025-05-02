const mongoose = require('mongoose');

// Replace 'test' with your actual database name from MONGO_URI
mongoose.connect('mongodb+srv://bharal224:bharal123@cluster0.0lbu8as.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
  .then(async () => {
    console.log('Connected to MongoDB');
    try {
      // Check if the students collection exists
      const collections = await mongoose.connection.db.listCollections().toArray();
      const studentsExists = collections.some(col => col.name === 'students');

      if (!studentsExists) {
        console.log('No students collection found. Creating one...');
        await mongoose.connection.db.createCollection('students');
      }

      // Get indexes
      const indexes = await mongoose.connection.db.collection('students').indexes();
      const rollNoIndex = indexes.find(index => index.name === 'rollNo_1');

      if (rollNoIndex) {
        await mongoose.connection.db.collection('students').dropIndex('rollNo_1');
        console.log('Dropped rollNo_1 index');
      } else {
        console.log('No rollNo_1 index found');
      }

      // Remove any rollNo field from existing documents
      await mongoose.connection.db.collection('students').updateMany(
        { rollNo: { $exists: true } },
        { $unset: { rollNo: "" } }
      );
      console.log('Removed rollNo field from existing documents');
    } catch (error) {
      console.error('Error:', error.message);
    } finally {
      await mongoose.connection.close();
      console.log('MongoDB connection closed');
    }
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });