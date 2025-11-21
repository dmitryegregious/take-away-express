export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  weight: number;
  image: string;
  category: string;
}

export const products: Product[] = [
  // Пицца
  {
    id: "1",
    name: "Пицца Маргарита",
    description: "Классическая пицца с моцареллой и томатами",
    price: 450,
    weight: 500,
    image: "/placeholder.svg",
    category: "pizza",
  },
  {
    id: "2",
    name: "Пицца Пепперони",
    description: "Острая пицца с пепперони и моцареллой",
    price: 550,
    weight: 550,
    image: "/placeholder.svg",
    category: "pizza",
  },
  {
    id: "3",
    name: "Пицца 4 сыра",
    description: "Моцарелла, пармезан, горгонзола, дор блю",
    price: 620,
    weight: 520,
    image: "/placeholder.svg",
    category: "pizza",
  },
  {
    id: "4",
    name: "Пицца Мясная",
    description: "Говядина, курица, свинина, бекон",
    price: 680,
    weight: 600,
    image: "/placeholder.svg",
    category: "pizza",
  },
  // Роллы
  {
    id: "5",
    name: "Филадельфия",
    description: "Роллы с лососем и сливочным сыром",
    price: 380,
    weight: 250,
    image: "/placeholder.svg",
    category: "rolls",
  },
  {
    id: "6",
    name: "Калифорния",
    description: "Роллы с крабом и авокадо",
    price: 350,
    weight: 240,
    image: "/placeholder.svg",
    category: "rolls",
  },
  {
    id: "7",
    name: "Темпура с креветкой",
    description: "Запеченные роллы с креветкой в темпуре",
    price: 420,
    weight: 280,
    image: "/placeholder.svg",
    category: "rolls",
  },
  {
    id: "8",
    name: "Дракон",
    description: "Роллы с угрем и огурцом",
    price: 450,
    weight: 270,
    image: "/placeholder.svg",
    category: "rolls",
  },
  // Напитки
  {
    id: "9",
    name: "Coca-Cola 0.5л",
    description: "Классическая кока-кола",
    price: 80,
    weight: 500,
    image: "/placeholder.svg",
    category: "drinks",
  },
  {
    id: "10",
    name: "Сок апельсиновый",
    description: "Свежевыжатый апельсиновый сок",
    price: 120,
    weight: 300,
    image: "/placeholder.svg",
    category: "drinks",
  },
  {
    id: "11",
    name: "Вода минеральная",
    description: "Газированная минеральная вода",
    price: 60,
    weight: 500,
    image: "/placeholder.svg",
    category: "drinks",
  },
  // Десерты
  {
    id: "12",
    name: "Чизкейк",
    description: "Нежный чизкейк с ягодным соусом",
    price: 180,
    weight: 150,
    image: "/placeholder.svg",
    category: "desserts",
  },
  {
    id: "13",
    name: "Тирамису",
    description: "Итальянский десерт с маскарпоне",
    price: 220,
    weight: 180,
    image: "/placeholder.svg",
    category: "desserts",
  },
  {
    id: "14",
    name: "Панна-котта",
    description: "Сливочный десерт с карамелью",
    price: 160,
    weight: 140,
    image: "/placeholder.svg",
    category: "desserts",
  },
];

export const categories = [
  { id: "all", name: "Все", image: "" },
  { id: "pizza", name: "Пицца", image: "" },
  { id: "rolls", name: "Роллы", image: "" },
  { id: "drinks", name: "Напитки", image: "" },
  { id: "desserts", name: "Десерты", image: "" },
];
