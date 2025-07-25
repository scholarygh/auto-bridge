# Auto-Bridge 🚗

A modern, full-featured car marketplace web application built with Next.js 14, TypeScript, and Tailwind CSS.

## ✨ Features

### 🏠 **Homepage**
- Stunning hero section with search functionality
- Featured cars showcase
- Statistics and social proof
- Call-to-action sections

### 🔍 **Car Listings**
- Advanced filtering and search
- Responsive grid layout
- Real-time filtering
- Sort options (price, year, mileage)
- Car condition badges
- Seller verification system

### 🎨 **Modern Design**
- Clean, professional UI
- Responsive design (mobile-first)
- Smooth animations and transitions
- Custom color scheme
- Modern typography (Inter + Poppins)

### 🛠 **Technical Stack**
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Forms**: React Hook Form + Zod validation

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd auto-bridge
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
auto-bridge/
├── app/                    # Next.js App Router
│   ├── cars/              # Car listings page
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Homepage
├── components/            # Reusable components
│   ├── Navigation.tsx     # Main navigation
│   └── Footer.tsx         # Footer component
├── lib/                   # Utility functions
│   └── utils.ts           # Common utilities
├── types/                 # TypeScript definitions
│   └── index.ts           # Type interfaces
├── public/                # Static assets
└── package.json           # Dependencies
```

## 🎯 Key Features

### **Search & Filtering**
- Real-time search by make, model, or keyword
- Price range filtering
- Car condition filtering
- Make-specific filtering
- Sort by price, year, mileage

### **Car Cards**
- High-quality car images
- Condition badges
- Seller verification status
- Rating system
- Location information
- Key specifications

### **Responsive Design**
- Mobile-first approach
- Tablet and desktop optimized
- Touch-friendly interactions
- Fast loading times

### **Modern UI/UX**
- Clean, professional design
- Smooth hover effects
- Loading states
- Error handling
- Accessibility features

## 🛠 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript check
```

### Code Style
- TypeScript for type safety
- ESLint for code quality
- Prettier for formatting
- Tailwind CSS for styling

## 🎨 Design System

### Colors
- **Primary**: Auto Blue (#3b82f6)
- **Secondary**: Auto Gray (#64748b)
- **Success**: Green (#10b981)
- **Warning**: Yellow (#f59e0b)
- **Error**: Red (#ef4444)

### Typography
- **Display**: Poppins (headings)
- **Body**: Inter (body text)

### Components
- Custom button styles
- Card hover effects
- Form inputs
- Navigation elements

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🔮 Future Enhancements

- [ ] User authentication system
- [ ] Car detail pages
- [ ] Contact forms
- [ ] Admin dashboard
- [ ] Payment integration
- [ ] Real-time messaging
- [ ] Image gallery
- [ ] Advanced filters
- [ ] Saved searches
- [ ] Email notifications

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, email hello@auto-bridge.com or create an issue in the repository.

---

**Built with ❤️ using Next.js, TypeScript, and Tailwind CSS** 