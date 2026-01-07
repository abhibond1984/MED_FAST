
export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  SHOP_OWNER = 'SHOP_OWNER',
  RIDER = 'RIDER',
  ADMIN = 'ADMIN'
}

export type ApprovalStatus = 'PENDING' | 'APPROVED' | 'BLOCKED';

export interface AppFeatures {
  enableDoctors: boolean;
  enablePharmacy: boolean;
  enableChatbot: boolean;
  enableAds: boolean;
  enableBlog: boolean;
}

export enum OrderStatus {
  PENDING = 'PENDING',
  REVIEWING = 'REVIEWING', // For Prescription
  PREPARING = 'PREPARING',
  READY_FOR_PICKUP = 'READY_FOR_PICKUP',
  ON_THE_WAY = 'ON_THE_WAY',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}

export interface Coordinates {
  x: number;
  y: number;
}

export interface SafetyAdvice {
  alcohol?: string;
  pregnancy?: string;
  driving?: string;
  breastfeeding?: string;
  kidney?: string;
  liver?: string;
}

export interface Medicine {
  id: string;
  name: string;
  description: string; // Short description
  longDescription?: string; // Detailed description
  introduction?: string; // Brief intro paragraph
  uses?: string[]; // Array of uses
  benefits?: string; // Key benefits text
  sideEffects?: string[]; // Array of side effects
  safetyAdvice?: SafetyAdvice; // Interaction warnings
  price: number;
  discount?: number; // Percentage discount (0-100)
  image: string;
  category: string;
  manufacturer?: string; // e.g. GSK, Cipla
  composition?: string; // e.g. Paracetamol (650mg)
  storage?: string; // e.g. Store below 30°C
  inStock: boolean;
  stockQuantity?: number; // Numeric stock tracking
  packSize: string; // e.g. "10 Tablets / Strip"
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string; // e.g. Orthopedics, Surgery
  qualification: string; // e.g. MBBS, MS
  experience: number; // Years
  location: string; // City/Area
  rating: number;
  consultationFee: number;
  image: string;
  available: boolean;
  hospitalName?: string;
  about?: string;
  patientsServed?: number;
  reviews?: Review[];
  status: ApprovalStatus; // Admin Control
}

export interface CartItem extends Medicine {
  quantity: number;
}

export interface FamilyMember {
  id: string;
  name: string;
  relation: string; // e.g., Mother, Father, Self
  age?: number;
  gender?: 'Male' | 'Female' | 'Other';
  address?: string; // Specific address for this member
  useMainAddress: boolean;
  prescriptions?: Prescription[]; // Prescriptions linked to this member
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  phone?: string;
  address?: string;
  status: ApprovalStatus; // Admin Control
  // Specific fields
  licenseNumber?: string; // For Shop/Rider
  gstIn?: string; // For Shop
  vehicleType?: string; // For Rider
  storeName?: string; // For Shop
  medicalHistory?: string[]; // For Customer
  joinedAt?: number;
  healthPoints?: number; // Loyalty System
  familyMembers?: FamilyMember[]; // For Family Profile Management
}

export interface Store {
  id: string;
  name: string;
  address: string;
  rating: number;
  distance: number; // in km
  location: Coordinates;
  image: string;
  status: ApprovalStatus;
}

export interface Prescription {
  id: string;
  imageUrl: string;
  uploadedAt: number;
  status: 'REVIEWING' | 'APPROVED' | 'REJECTED';
  notes?: string;
  doctorName?: string;
  diagnosis?: string;
}

export interface Order {
  id: string;
  customerId: string;
  customerName?: string; // Snapshot
  storeId?: string; // The assigned store
  items: CartItem[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: number;
  shopLocation: Coordinates;
  customerLocation: Coordinates;
  riderLocation?: Coordinates;
  estimatedDeliveryTime?: number;
  prescriptionImage?: string; // If order is via prescription
  paymentMethod?: string;
  otp?: string; // Proof of delivery
  isSubscription?: boolean; // Automatic refills
  rating?: number; // Customer feedback
  feedback?: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
