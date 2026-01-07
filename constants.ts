
import { Medicine, Coordinates, UserProfile, UserRole, Store, Doctor, AppFeatures } from './types';

export const SHOP_LOCATION: Coordinates = { x: 20, y: 20 };
export const CUSTOMER_LOCATION: Coordinates = { x: 80, y: 80 };

export const DEFAULT_FEATURES: AppFeatures = {
  enableDoctors: true,
  enablePharmacy: true,
  enableChatbot: true,
  enableAds: true,
  enableBlog: false
};

export const MOTIVATIONAL_QUOTES = [
  "Health is the greatest gift, contentment the greatest wealth.",
  "Take care of your body. It's the only place you have to live.",
  "A healthy outside starts from the inside.",
  "Prevention is better than cure.",
  "Your health is an investment, not an expense.",
  "Small steps every day lead to big results.",
  "Wellness is a connection of paths: knowledge and action."
];

export const DOCTOR_SPECIALTIES = [
  'All',
  'Orthopedics',
  'General Physician',
  'Surgery',
  'Cardiology',
  'Pediatrics',
  'Dermatology',
  'Gynecology'
];

export const DOCTORS: Doctor[] = [
  {
    id: 'd1',
    name: 'Dr. Rajesh Verma',
    specialty: 'Orthopedics',
    qualification: 'MBBS, MS (Ortho)',
    experience: 15,
    location: 'Bandra West, Mumbai',
    rating: 4.9,
    consultationFee: 1200,
    available: true,
    hospitalName: 'Lilavati Hospital',
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400',
    about: 'Dr. Rajesh Verma is a leading Orthopedic Surgeon specializing in joint replacement and sports injuries. With over 15 years of experience, he has performed over 2000 successful surgeries.',
    patientsServed: 5000,
    status: 'APPROVED',
    reviews: [
      { id: 'r1', userName: 'Amit K.', rating: 5, comment: 'Excellent doctor. My knee pain is gone!', date: '2 days ago' },
      { id: 'r2', userName: 'Sneha P.', rating: 4, comment: 'Wait time was a bit long, but treatment was perfect.', date: '1 week ago' },
      { id: 'r3', userName: 'Rahul D.', rating: 5, comment: 'Very professional and polite.', date: '2 weeks ago' }
    ]
  },
  {
    id: 'd2',
    name: 'Dr. Anita Desai',
    specialty: 'Surgery',
    qualification: 'MBBS, MS (General Surgery)',
    experience: 12,
    location: 'Andheri East, Mumbai',
    rating: 4.8,
    consultationFee: 1500,
    available: true,
    hospitalName: 'SevenHills Hospital',
    image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=400',
    about: 'Dr. Anita Desai is a senior General Surgeon known for her precision in laparoscopic surgeries. She is dedicated to providing compassionate care and ensures quick recovery for her patients.',
    patientsServed: 3200,
    status: 'APPROVED',
    reviews: [
      { id: 'r4', userName: 'Priya M.', rating: 5, comment: 'She saved my life. Forever grateful.', date: '1 month ago' },
      { id: 'r5', userName: 'Karan S.', rating: 5, comment: 'Best surgeon in Mumbai.', date: '2 months ago' }
    ]
  },
  {
    id: 'd3',
    name: 'Dr. Sameer Khan',
    specialty: 'General Physician',
    qualification: 'MBBS, MD',
    experience: 8,
    location: 'Juhu, Mumbai',
    rating: 4.7,
    consultationFee: 800,
    available: true,
    hospitalName: 'Criticare Hospital',
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400',
    about: 'Dr. Sameer Khan focuses on preventive medicine and managing chronic conditions like diabetes and hypertension. He believes in holistic wellness.',
    patientsServed: 8000,
    status: 'APPROVED',
    reviews: [
      { id: 'r6', userName: 'Vikas G.', rating: 4, comment: 'Good doctor for general flu.', date: '3 days ago' },
      { id: 'r7', userName: 'Meera L.', rating: 5, comment: 'Very understanding and listens patiently.', date: '5 days ago' }
    ]
  },
  {
    id: 'd4',
    name: 'Dr. Priya Mehta',
    specialty: 'Dermatology',
    qualification: 'MBBS, DVD',
    experience: 10,
    location: 'Khar West, Mumbai',
    rating: 4.9,
    consultationFee: 1000,
    available: false,
    hospitalName: 'Skin Care Clinic',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400',
    about: 'Dr. Priya Mehta is a renowned Dermatologist specializing in clinical and aesthetic dermatology. She helps patients achieve healthy, glowing skin.',
    patientsServed: 4500,
    status: 'APPROVED',
    reviews: [
      { id: 'r8', userName: 'Sonia R.', rating: 5, comment: 'My acne cleared up in 2 weeks!', date: '1 week ago' },
      { id: 'r9', userName: 'Arjun K.', rating: 5, comment: 'Great advice on skin care routine.', date: '3 weeks ago' }
    ]
  },
  {
    id: 'd5',
    name: 'Dr. Vikram Malhotra',
    specialty: 'Cardiology',
    qualification: 'MBBS, DM (Cardio)',
    experience: 20,
    location: 'Mahim, Mumbai',
    rating: 5.0,
    consultationFee: 2000,
    available: true,
    hospitalName: 'Hinduja Hospital',
    image: 'https://images.unsplash.com/photo-1537368910025-bc005fbede68?auto=format&fit=crop&q=80&w=400',
    about: 'Dr. Vikram Malhotra is a senior Cardiologist with expertise in interventional cardiology. He has a stellar record in managing complex heart conditions.',
    patientsServed: 12000,
    status: 'APPROVED',
    reviews: [
      { id: 'r10', userName: 'Ramesh T.', rating: 5, comment: 'God bless him. He treated my father so well.', date: '2 days ago' },
      { id: 'r11', userName: 'Geeta W.', rating: 5, comment: 'Very experienced and calm.', date: '1 month ago' }
    ]
  },
  {
    id: 'd6',
    name: 'Dr. Suman Rao',
    specialty: 'Pediatrics',
    qualification: 'MBBS, DCH',
    experience: 6,
    location: 'Dadar, Mumbai',
    rating: 4.6,
    consultationFee: 700,
    available: true,
    hospitalName: 'Child Care Clinic',
    image: 'https://images.unsplash.com/photo-1614608682850-e0d6ed316d46?auto=format&fit=crop&q=80&w=400',
    about: 'Dr. Suman Rao is a friendly Pediatrician who specializes in child nutrition and vaccination. Kids love her gentle approach.',
    patientsServed: 6000,
    status: 'APPROVED',
    reviews: [
      { id: 'r12', userName: 'Neha S.', rating: 5, comment: 'My baby stops crying as soon as she sees her.', date: '4 days ago' },
      { id: 'r13', userName: 'Rajiv M.', rating: 4, comment: 'Good doctor but clinic is crowded.', date: '1 week ago' }
    ]
  },
  {
    id: 'd7',
    name: 'Dr. New Applicant',
    specialty: 'Cardiology',
    qualification: 'MBBS',
    experience: 2,
    location: 'Mumbai',
    rating: 0,
    consultationFee: 500,
    available: true,
    image: 'https://images.unsplash.com/photo-1537368910025-bc005fbede68?auto=format&fit=crop&q=80&w=400',
    status: 'PENDING'
  }
];

// EXPANDED DATABASE OF MEDICINES (Comprehensive Indian Market)
export const MEDICINES: Medicine[] = [
  // --- Fever & Pain ---
  {
    id: 'm1',
    name: 'Dolo 650mg',
    manufacturer: 'Micro Labs Ltd',
    composition: 'Paracetamol (650mg)',
    introduction: 'Dolo 650 Tablet is an analgesic (pain reliever) and antipyretic (fever reducer). It blocks the release of certain chemical messengers in the brain that are responsible for pain and fever.',
    description: 'Trusted fever and pain relief tablets.',
    longDescription: 'Dolo 650 Tablet is a common painkiller used to treat aches and pains. It works by blocking chemical messengers in the brain that tell us we have pain. It is effective in relieving pain caused by headache, migraine, nerve pain, toothache, sore throat, period (menstrual) pains, arthritis, and muscle aches.',
    uses: ['Fever', 'Headache', 'Muscle Pain', 'Dental Pain'],
    sideEffects: ['Nausea', 'Vomiting', 'Stomach pain', 'Loss of appetite'],
    safetyAdvice: {
        alcohol: "Unsafe - Avoid alcohol while taking Dolo 650 as it may increase the risk of liver damage.",
        pregnancy: "Safe if prescribed - Generally considered safe during pregnancy, but consult your doctor.",
        driving: "Safe - Usually does not affect your ability to drive.",
        kidney: "Caution - Use with caution if you have kidney disease."
    },
    storage: "Store below 30°C in a dry place.",
    price: 30.00,
    discount: 10,
    category: 'Fever & Pain',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=400',
    inStock: true,
    stockQuantity: 150,
    packSize: '15 Tablets / Strip'
  },
  {
    id: 'm5',
    name: 'Combiflam',
    manufacturer: 'Sanofi India Ltd',
    composition: 'Ibuprofen (400mg) + Paracetamol (325mg)',
    description: 'Ibuprofen + Paracetamol for muscular pain.',
    longDescription: 'Combiflam Tablet contains two painkiller medicines: Ibuprofen and Paracetamol. It is used to relieve pain, inflammation, and swelling in conditions that affect muscles and joints.',
    introduction: 'Combiflam is a combination medicine used for short-term relief of pain, inflammation, and swelling.',
    uses: ['Muscle pain', 'Joint pain', 'Toothache', 'Menstrual cramps'],
    sideEffects: ['Indigestion', 'Stomach pain', 'Heartburn', 'Dizziness'],
    safetyAdvice: {
        alcohol: "Unsafe - Consuming alcohol with Combiflam can cause stomach bleeding.",
        pregnancy: "Consult Doctor - Not recommended during the last 3 months of pregnancy.",
        driving: "Caution - May cause dizziness or drowsiness.",
        kidney: "Unsafe - Not recommended for patients with severe kidney disease."
    },
    storage: "Store below 30°C.",
    price: 42.00,
    discount: 5,
    category: 'Fever & Pain',
    image: 'https://images.unsplash.com/photo-1628771065518-0d82f1938462?auto=format&fit=crop&q=80&w=400',
    inStock: true,
    stockQuantity: 80,
    packSize: '20 Tablets / Strip'
  },
  {
    id: 'm7',
    name: 'Saridon',
    manufacturer: 'Piramal Healthcare',
    composition: 'Paracetamol + Propyphenazone + Caffeine',
    description: 'Fast relief from severe headaches.',
    longDescription: 'Saridon is an effective remedy for headaches. It contains Paracetamol, Propyphenazone and Caffeine. It starts working in 15 minutes to provide relief.',
    uses: ['Headache', 'Migraine', 'Toothache'],
    sideEffects: ['Nervousness', 'Insomnia', 'Nausea'],
    safetyAdvice: {
       alcohol: "Unsafe",
       pregnancy: "Consult Doctor"
    },
    price: 45.00,
    category: 'Fever & Pain',
    image: 'https://images.unsplash.com/photo-1555633514-abafa4d633b5?auto=format&fit=crop&q=80&w=400',
    inStock: true,
    stockQuantity: 200,
    packSize: '10 Tablets / Strip'
  },
  {
    id: 'm20',
    name: 'Crocin Advance',
    manufacturer: 'GSK',
    composition: 'Paracetamol (650mg)',
    description: 'Fast release paracetamol for fever.',
    longDescription: 'Crocin Advance 650mg Tablet helps relieve pain and fever by blocking the release of certain chemical messengers that cause pain and fever.',
    uses: ['Fever', 'Body Ache', 'Headache'],
    sideEffects: ['Nausea', 'Gastric irritation'],
    safetyAdvice: {
       alcohol: "Unsafe",
       pregnancy: "Safe if prescribed"
    },
    price: 20.00,
    category: 'Fever & Pain',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=400',
    inStock: true,
    stockQuantity: 50,
    packSize: '15 Tablets / Strip'
  },
  // --- Antibiotics ---
  {
    id: 'm2',
    name: 'Augmentin 625 Duo',
    manufacturer: 'GlaxoSmithKline Pharmaceuticals Ltd',
    composition: 'Amoxicillin (500mg) + Clavulanic Acid (125mg)',
    description: 'Amoxicillin + Clavulanic Acid antibiotic.',
    longDescription: 'Augmentin 625 Duo Tablet is a penicillin-type antibiotic that helps your body fight infections caused by bacteria. It is used to treat infections of the lungs (e.g., pneumonia), ear, nasal sinus, urinary tract, skin, and soft tissue.',
    introduction: 'Augmentin 625 Duo Tablet is an antibiotic agent that fights bacteria.',
    uses: ['Bacterial Infections', 'Pneumonia', 'Ear Infections', 'UTI'],
    sideEffects: ['Diarrhea', 'Nausea', 'Vomiting', 'Skin Rash'],
    safetyAdvice: {
        alcohol: "Caution - Alcohol does not affect the working of Augmentin, but can increase side effects.",
        pregnancy: "Safe if prescribed - Generally considered safe.",
        liver: "Caution - Dose adjustment may be needed."
    },
    storage: "Store below 25°C in a cool dry place.",
    price: 205.00,
    discount: 15,
    category: 'Antibiotics',
    image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&q=80&w=400',
    inStock: true,
    stockQuantity: 40,
    packSize: '6 Tablets / Strip'
  },
   // --- Vitamins & Supplements ---
  {
    id: 'm4',
    name: 'Limcee Vitamin C',
    manufacturer: 'Abbott',
    composition: 'Ascorbic Acid (500mg)',
    description: 'Immunity booster chewable tablets.',
    longDescription: 'Limcee Tablet is a nutritional supplement containing Vitamin C (Ascorbic Acid). It is essential for the growth, development, and repair of all body tissues and immunity.',
    uses: ['Immunity', 'Skin health', 'Wound healing'],
    sideEffects: ['Heartburn', 'Nausea (if taken in excess)'],
    price: 35.00,
    discount: 5,
    category: 'Vitamins',
    image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&q=80&w=400',
    inStock: true,
    stockQuantity: 120,
    packSize: '15 Tablets / Strip'
  },
  {
    id: 'm12',
    name: 'Shelcal 500',
    manufacturer: 'Torrent Pharmaceuticals',
    composition: 'Calcium (500mg) + Vitamin D3 (250 IU)',
    description: 'Calcium + Vitamin D3 for strong bones.',
    longDescription: 'Shelcal 500 Tablet is a nutritional supplement used in the treatment of calcium deficiency. It is useful for maintaining healthy bones and teeth.',
    uses: ['Calcium Deficiency', 'Osteoporosis', 'Bone Health'],
    sideEffects: ['Constipation', 'Stomach upset'],
    price: 130.00,
    category: 'Vitamins',
    image: 'https://images.unsplash.com/photo-1576073719676-aa95576f2043?auto=format&fit=crop&q=80&w=400',
    inStock: true,
    stockQuantity: 60,
    packSize: '15 Tablets / Strip'
  },
  {
    id: 'm30',
    name: 'Revital H',
    manufacturer: 'Sun Pharma',
    composition: 'Ginseng, Vitamins & Minerals',
    description: 'Daily multivitamin capsule.',
    longDescription: 'Revital H Capsule is a combination of Ginseng, Vitamins and Minerals. It helps in fighting fatigue and keeping you energetic throughout the day.',
    uses: ['Energy', 'Immunity', 'Stamina'],
    sideEffects: ['Nausea', 'Headache (rare)'],
    price: 330.00,
    discount: 10,
    category: 'Vitamins',
    image: 'https://images.unsplash.com/photo-1550572017-edd951aa8f72?auto=format&fit=crop&q=80&w=400',
    inStock: true,
    stockQuantity: 75,
    packSize: '30 Capsules / Bottle'
  }
];

export const MOCK_USERS: Record<UserRole, UserProfile> = {
  [UserRole.CUSTOMER]: {
    id: 'USER-1',
    name: 'Aditi Sharma',
    email: 'aditi@example.com',
    role: UserRole.CUSTOMER,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
    phone: '+91 98765 43210',
    address: '800 Park Avenue, Apt 4B, Mumbai',
    medicalHistory: ['Mild Asthma', 'Penicillin Allergy'],
    joinedAt: Date.now() - 10000000,
    healthPoints: 240,
    status: 'APPROVED',
    familyMembers: [
      {
        id: 'fam-1',
        name: 'Aditi Sharma',
        relation: 'Self',
        useMainAddress: true,
        prescriptions: []
      }
    ]
  },
  [UserRole.SHOP_OWNER]: {
    id: 'SHOP-1',
    name: 'Rajesh Gupta',
    email: 'rajesh@medfast.com',
    role: UserRole.SHOP_OWNER,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200',
    storeName: 'Apollo Pharmacy - Bandra',
    licenseNumber: 'MH-MZ4-123456',
    gstIn: '27ABCDE1234F1Z5',
    joinedAt: Date.now() - 20000000,
    status: 'APPROVED'
  },
  [UserRole.RIDER]: {
    id: 'RIDER-1',
    name: 'Vikram Singh',
    email: 'vikram@medfast.com',
    role: UserRole.RIDER,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    vehicleType: 'Electric Scooter (Hero Electric)',
    licenseNumber: 'DL-04-2022-9876543',
    joinedAt: Date.now() - 5000000,
    status: 'APPROVED'
  },
  [UserRole.ADMIN]: {
    id: 'ADMIN-1',
    name: 'System Admin',
    email: 'admin@medfast.com',
    role: UserRole.ADMIN,
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
    joinedAt: Date.now(),
    status: 'APPROVED'
  }
};

export const NEARBY_STORES: Store[] = [
  {
    id: 'STORE-1',
    name: 'Apollo Pharmacy',
    address: 'Hill Road, Bandra West',
    rating: 4.8,
    distance: 1.2,
    location: { x: 20, y: 20 },
    image: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?auto=format&fit=crop&q=80&w=400',
    status: 'APPROVED'
  },
  {
    id: 'STORE-2',
    name: 'Wellness Forever',
    address: 'Linking Road, Khar',
    rating: 4.5,
    distance: 2.5,
    location: { x: 35, y: 45 },
    image: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?auto=format&fit=crop&q=80&w=400',
    status: 'APPROVED'
  },
  {
    id: 'STORE-3',
    name: 'Noble Plus Chemist',
    address: 'Juhu Tara Road',
    rating: 4.2,
    distance: 3.8,
    location: { x: 10, y: 60 },
    image: 'https://images.unsplash.com/photo-1576602976047-174e57a47881?auto=format&fit=crop&q=80&w=400',
    status: 'APPROVED'
  }
];
