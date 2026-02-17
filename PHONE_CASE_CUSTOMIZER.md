# Phone Case Customizer - Feature Documentation

## 🎨 Overview

A comprehensive phone case customization tool that allows customers to design their own unique phone cases with images, text, stickers, and various color options.

## ✨ Features

### 1. **Phone Model Selection**
- Multiple phone models supported:
  - iPhone 14
  - iPhone 14 Pro
  - Samsung Galaxy S23
  - Samsung Galaxy S23 Ultra
  - OnePlus 11
- Each model has accurate frame dimensions and print areas

### 2. **Case Color Customization**
- 8 premium color options:
  - Clear (Transparent)
  - Black
  - White
  - Navy
  - Rose
  - Mint
  - Lavender
  - Coral

### 3. **Image Upload**
- Drag and drop image upload
- Supports JPG, PNG, GIF formats
- Maximum file size: 5MB
- Images can be:
  - Moved (drag)
  - Resized (scale)
  - Rotated
  - Deleted

### 4. **Text Customization**
- Add custom text to your design
- Font options:
  - Arial
  - Georgia
  - Courier New
  - Comic Sans MS
  - Impact
  - Brush Script MT
  - Lucida Handwriting
- Adjustable font size (12px - 72px)
- Custom text color with color picker
- Full transform controls (move, rotate, scale)

### 5. **Decorative Elements**
- 24 built-in stickers and emojis:
  - Stars, hearts, sparkles
  - Nature elements (rainbow, butterfly, flowers)
  - Fun icons (music, games, art)
  - Weather elements (sun, moon, lightning)
- All stickers are fully customizable (move, resize, rotate)

### 6. **Interactive Canvas**
- Real-time preview with phone frame
- Visual print area guide
- Click to select elements
- Drag to reposition
- Resize and rotate handles
- Selected element highlighting

### 7. **Preview & Export**
- Full-screen preview modal
- Shows final design with phone frame
- Displays order summary
- Download design as PNG
- Add to cart functionality

## 🚀 Usage

### Accessing the Customizer

Navigate to: `/customize-phone-case`

Or add a link in your navigation:
```tsx
<Link to="/customize-phone-case">Design Phone Case</Link>
```

### Workflow

1. **Select Phone Model**
   - Choose your phone brand and model from the dropdown
   - The canvas will update to show the correct phone dimensions

2. **Choose Case Color**
   - Click on any color swatch to change the case background
   - Selected color will have a purple ring indicator

3. **Add Images**
   - Click the "Upload" tab
   - Click the upload area or drag files
   - Image will appear on the canvas
   - Click and drag to reposition
   - Use handles to resize and rotate

4. **Add Text**
   - Click the "Text" tab
   - Enter your text in the input field
   - Select font, size, and color
   - Click "Add Text to Design"
   - Text appears on canvas with full transform controls

5. **Add Stickers**
   - Click the "Decorations" tab
   - Click any sticker to add it to your design
   - Stickers can be moved, resized, and rotated

6. **Manage Elements**
   - Click any element to select it
   - Selected elements show a purple ring
   - Use the "Delete Element" button to remove
   - Use Moveable handles to transform

7. **Preview & Purchase**
   - Click "Preview Design" to see final result
   - Review your design in the modal
   - Click "Add to Cart" to proceed to checkout
   - Or click "Edit More" to continue customizing

## 🛠️ Technical Details

### Dependencies Used

- **react-moveable**: Provides drag, resize, and rotate functionality
- **@mui/material**: Dialog components for preview modal
- **@radix-ui/react-tabs**: Tab navigation for tools
- **lucide-react**: Icons throughout the interface

### Component Structure

```
PhoneCaseCustomizer/
├── Phone Model Selection
├── Color Picker
├── Tabs (Phone, Image, Text, Decor)
├── Canvas Preview
│   ├── Phone Frame
│   ├── Print Area Guide
│   └── Design Elements (with Moveable)
├── Element Controls
└── Preview Modal
```

### State Management

```typescript
interface DesignElement {
  id: string;
  type: 'image' | 'text' | 'sticker';
  content: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  scale: number;
  fontSize?: number;      // Text only
  fontFamily?: string;    // Text only
  color?: string;         // Text only
}
```

## 🎯 Integration Points

### Checkout Integration

The "Add to Cart" button in the preview modal currently shows an alert. To integrate with your checkout:

```typescript
// In the preview modal
<Button
  onClick={() => {
    // 1. Save design to database
    const designData = {
      model: selectedModel,
      caseColor: caseColor,
      elements: designElements,
      price: 499
    };
    
    // 2. Add to cart
    addToCart(designData);
    
    // 3. Navigate to checkout
    navigate('/checkout');
  }}
>
  Add to Cart
</Button>
```

### Backend API Endpoints Needed

```typescript
// Save custom design
POST /api/designs
Body: {
  userId: string,
  phoneModel: string,
  caseColor: string,
  elements: DesignElement[],
  preview: string (base64 image)
}

// Get user's designs
GET /api/designs/:userId

// Update design
PUT /api/designs/:designId

// Delete design
DELETE /api/designs/:designId
```

## 🎨 Customization Options

### Adding New Phone Models

```typescript
const PHONE_MODELS = {
  'your-model-id': {
    name: 'Model Name',
    brand: 'Brand Name',
    frameWidth: 350,
    frameHeight: 700,
    printArea: { x: 25, y: 80, width: 300, height: 540 }
  }
};
```

### Adding New Colors

```typescript
const CASE_COLORS = [
  { name: 'Color Name', value: '#hexcode', border: '#hexcode' }
];
```

### Adding New Stickers

```typescript
const STICKERS = [
  '🎨', '🎭', // Add any emoji or unicode character
];
```

## 📱 Responsive Design

The customizer is fully responsive:
- **Desktop**: 3-column layout (tools | canvas | info)
- **Tablet**: 2-column layout
- **Mobile**: Stacked layout

## 🔧 Future Enhancements

Potential features to add:

1. **Advanced Image Editing**
   - Crop tool
   - Filters and effects
   - Brightness/contrast adjustments

2. **Pattern Backgrounds**
   - Pre-made patterns
   - Gradient backgrounds
   - Texture overlays

3. **Layer Management**
   - Layer ordering (bring to front/send to back)
   - Layer visibility toggle
   - Layer locking

4. **Templates**
   - Pre-designed templates
   - Save custom templates
   - Template marketplace

5. **Collaboration**
   - Share designs with friends
   - Collaborative editing
   - Design comments

6. **Export Options**
   - Multiple file formats
   - High-resolution export
   - Print-ready files

## 🐛 Known Limitations

1. Download feature currently shows alert (needs canvas-to-image implementation)
2. Moveable controls might overlap on small screens
3. No undo/redo functionality yet
4. No layer ordering controls

## 📝 Notes

- All designs are client-side only until saved to backend
- Images are stored as base64 in state (consider optimization for production)
- Print area guides are visual only (no enforcement of boundaries)

## 🎉 Getting Started

1. Navigate to `/customize-phone-case`
2. Select your phone model
3. Choose a case color
4. Start designing!

For questions or issues, please refer to the main project documentation.
