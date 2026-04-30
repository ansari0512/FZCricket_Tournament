// Seed initial configs (run once)
const mongoose = require('mongoose');
const Config = require('./models/Config');

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  console.log('MongoDB connected for seeding');
  
  const configs = [
    { key: 'UPI_GPAY', value: 'your_upi_gpay@oksbi', description: 'GPay UPI ID for payments' },
    { key: 'UPI_PHONEPE', value: 'your_upi_phonepe@ybl', description: 'PhonePe UPI ID for payments' },
    { key: 'UPI_PAYTM', value: 'your_upi_paytm@ptaxis', description: 'Paytm UPI ID for payments' }
  ];
  
  for (const config of configs) {
    await Config.findOneAndUpdate(
      { key: config.key },
      config,
      { upsert: true, new: true }
    );
    console.log(`Config ${config.key} updated`);
  }
  
  console.log('Seeding complete');
  process.exit(0);
}).catch(err => {
  console.error('Seeding failed:', err);
  process.exit(1);
});