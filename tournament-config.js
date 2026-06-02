/**
 * CENTRALIZED TOURNAMENT CONFIGURATION
 * 🏏 सभी टूर्नामेंट की जानकारी एक जगह
 * 
 * यहाँ सब कुछ एडिट करें - बाकी सब जगह खुद बदल जाएगा
 */

const TOURNAMENT_CONFIG = {
  // ========== BASIC INFO ==========
  tournament: {
    name: 'Firoz Shah Cricket',
    year: 2026,
    title: 'Firoz Shah Cricket Tournament 2026',
    tagline: 'Village level cricket tournament - Odajhar, Sitapur. 8 Teams, 8 Overs, Big Prize!',
    description: 'Firoz Shah Cricket Tournament 2026 - Village Odajhar, Post Naseerpur, Biswan, Sitapur. Register your team, view schedule, live scores and results.'
  },

  // ========== DATES ==========
  dates: {
    registrationStart: '10 Apr 2026',
    registrationEnd: '20 Apr 2026',
    tournamentStart: '21 Apr 2026',
    marqueeText: '🏏 &nbsp; Team Registration: 10–20 Apr 2026 &nbsp; • &nbsp; Tournament Start: 21 Apr 2026 &nbsp; 🏏'
  },

  // ========== TOURNAMENT STRUCTURE ==========
  structure: {
    maxTeams: 8,
    playersPerTeam: 15,
    groupStageOvers: 8,
    semiFinalsOvers: 10,
    finalsOvers: 10,
    matchTypes: ['group', 'semi-final', 'final']
  },

  // ========== REGISTRATION & PAYMENT ==========
  payment: {
    registrationFeeTotal: 1100,
    advancePayment: 300,
    remainingPayment: 800,
    advancePaymentMessage: 'Please pay ₹300 advance fee to complete registration.',
    remainingPaymentMessage: 'Please pay ₹800 remaining fee before first match.',
    currency: 'INR',
    currencySymbol: '₹'
  },

  // ========== PRIZE MONEY ==========
  prizes: {
    entryFee: {
      amount: 1100,
      display: '₹1,100',
      label: 'Per Team'
    },
    firstPlace: {
      amount: 7000,
      display: '₹7,000',
      label: '1st Place + Trophy'
    },
    secondPlace: {
      amount: 3000,
      display: '₹3,000',
      label: '2nd Place + Trophy'
    }
  },

  // ========== LOCATION & VENUE ==========
  location: {
    defaultVenue: 'Odajhar Village',
    defaultCity: 'Odajhar',
    fullAddress: 'Village Odajhar, Post Naseerpur, Biswan, Sitapur - 261202',
    postalCode: '261202',
    state: 'Uttar Pradesh'
  },

  // ========== CONTACT INFORMATION ==========
  contacts: [
    {
      icon: '📞',
      name: 'Saddam Husain',
      value: '+91 8127021765',
      href: 'tel:+918127021765',
      type: 'phone'
    },
    {
      icon: '📞',
      name: 'Mohd Sufiyan',
      value: '+91 9369429653',
      href: 'tel:+919369429653',
      type: 'phone'
    },
    {
      icon: 'whatsapp',
      name: 'WhatsApp Group',
      value: 'Join Now',
      href: 'https://chat.whatsapp.com/CR4Wx8QgHbJFaTnDkuTkxu',
      type: 'whatsapp'
    }
  ],

  // ========== ORGANIZER DETAILS ==========
  organizer: {
    mainContactPerson: 'Shahid Ansari',
    role: 'Tournament Organizer'
  },

  // ========== DETAILS (for Contact page) ==========
  details: [
    {
      label: 'Contact Person',
      value: 'Shahid Ansari',
      icon: '👤'
    },
    {
      label: 'Venue',
      value: 'Village Odajhar, Post Naseerpur, Biswan, Sitapur - 261202',
      icon: '📍'
    }
  ],

  // ========== TOURNAMENT RULES (हिंदी में) ==========
  tournamentRules: [
    {
      icon: '👥',
      color: '#38bdf8',
      title: '1. टीमें',
      text: 'इस टूर्नामेंट में अधिकतम 8 टीमें ही भाग ले सकती हैं।'
    },
    {
      icon: '🏏',
      color: '#818cf8',
      title: '2. मैच फॉर्मेट',
      text: 'सभी मैच 8-8 ओवर के होंगे, जबकि सेमीफाइनल और फाइनल 10-10 ओवर के होंगे।'
    },
    {
      icon: '⚡',
      color: '#60a5fa',
      title: '3. पावर प्ले',
      text: 'शुरुआती 2 ओवर पावर प्ले होंगे, जिसमें सर्कल के बाहर केवल 2 खिलाड़ी ही फील्डिंग कर सकते हैं।'
    },
    {
      icon: '🎯',
      color: '#c7d2fe',
      title: '4. बॉलिंग नियम',
      text: 'प्रत्येक बॉलर अधिकतम 2 ओवर ही गेंदबाजी कर सकता है।'
    },
    {
      icon: '🎾',
      color: '#93c5fd',
      title: '5. बॉल',
      text: 'सभी मैच Sixit टेनिस बॉल से खेले जाएंगे।'
    },
    {
      icon: '🏘️',
      color: '#0ea5e9',
      title: '6. खिलाड़ी पात्रता',
      text: 'केवल गांव स्तर (Village Level) के खिलाड़ी ही भाग ले सकते हैं।'
    },
    {
      icon: '📊',
      color: '#6366f1',
      title: '7. ग्रुप स्टेज',
      text: '8 टीमों को 2 ग्रुप में बांटा जाएगा। हर टीम अपने ग्रुप की 3 टीमों से खेलेगी।'
    },
    {
      icon: '🥊',
      color: '#818cf8',
      title: '8. सेमीफाइनल',
      text: 'दोनों ग्रुप की टॉप 2 टीमों के बीच सेमीफाइनल खेला जाएगा।'
    },
    {
      icon: '🏆',
      color: '#38bdf8',
      title: '9. फाइनल',
      text: 'सेमीयफाइनल जीतने वाली टीमों के बीच फाइनल मैच होगा।'
    },
    {
      icon: '💰',
      color: '#60a5fa',
      title: '10. इनाम',
      text: 'फाइनल जीतने वाली टीम को ₹7000 और ट्रॉफी, हारने वाली टीम को ₹3000 और ट्रॉफी।'
    },
    {
      icon: '⭐',
      color: '#a5b4fc',
      title: '11. मैन ऑफ द मैच',
      text: 'प्रत्येक मैच में "मैन ऑयफ द मैच" दिया जाएगा।'
    },
    {
      icon: '📅',
      color: '#818cf8',
      title: '12. अंपायर निर्णय',
      text: 'अंपायर का फैसला अंतिम होगा।'
    }
  ],

  // ========== REGISTRATION RULES (हिंदी में) ==========
  registrationRules: [
    'इस टूर्नामेंट में भाग लेने के लिए टीम को वेबसाइट पर जाकर रजिस्टर करना अनिवार्य है।',
    'टीम रजिस्टर करने के लिए पहले Google से Login करना होगा।',
    'टीम रजिस्टर करते समय सभी जानकारी सही-सही भरनी होगी, गलत जानकारी पर टीम रिजेक्ट कर दी जाएगी।',
    'प्रत्येक टीम में कुल 15 खिलाड़ियों को रजिस्टर करना अनिवार्य है और उन्हीं खिलाड़ियों को खेलने की अनुमति होगी।',
    'टीम में 8 खिलाड़ी एक ही गांव के और अधिकतम 3 खिलाड़ी अन्य गांव के हो सकते हैं।',
    'टीम को अपने सभी बॉलर्स की जानकारी रजिस्ट्रेशन के समय ही देनी होगी।',
    'टीम का रजिस्ट्रेशन पहले कमेटी द्वारा चेक किया जाएगा, उसके बाद ही अप्रूवल मिलेगा।',
    'अप्रूवल मिलने के बाद ₹300 रजिस्ट्रेशन फीस जमा करना अनिवार्य है।',
    'मैच शुरू होने से पहले बाकी ₹800 एंट्री फीस जमा करनी होगी।',
    'रजिस्ट्रेशन फीस किसी भी स्थिति में वापस नहीं की जाएगी।',
    'यदि टीम रिजेक्ट होती है तो कारण देखकर दोबारा सही जानकारी के साथ रजिस्टर किया जा सकता है।',
    'एक बार टीम अप्रूव होने के बाद री-एंट्री की अनुमति नहीं होगी।',
    'सभी नियमों को ध्यान से पढ़कर ही टीम रजिस्टर करें।'
  ]
};

module.exports = TOURNAMENT_CONFIG;
module.exports.default = TOURNAMENT_CONFIG;
module.exports.TOURNAMENT_CONFIG = TOURNAMENT_CONFIG;
