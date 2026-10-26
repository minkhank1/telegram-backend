const express = require('express');
  const axios = require('axios');
  const cors = require('cors');

  const app = express();
  app.use(express.json());
  app.use(cors());

  const BOT_TOKEN = '8861271774:AAGgwL27wYtEgnLFkczk6PhazNKKZ1QETMI';
  const CHANNEL_ID = '-1003074985702';

  app.get('/', (req, res) => res.send('Server Running!'));

  app.post('/api/verify-access', async (req, res) => {
      const { userId } = req.body;
      if (!userId) return res.status(400).json({ allowed: false, message: 'User ID missing' });

      try {
          const response = await axios.get(
              `https://api.telegram.org/bot${BOT_TOKEN}/getChatMember`,
              { params: { chat_id: CHANNEL_ID, user_id: userId } }
          );
          const status = response.data?.result?.status;

          if (['creator', 'administrator', 'member'].includes(status)) {
              return res.json({ allowed: true, status: status });
          } else {
              return res.json({ allowed: false, message: 'Channel Member မဟုတ်ပါ။' });
          }
      } catch (error) {
          return res.json({ allowed: false, message: 'Channel ဝင်ရောက်ထားခြင်း မရှိပါ။' });
      }
  });

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Server on port ${PORT}`));
