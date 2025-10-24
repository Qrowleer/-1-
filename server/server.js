import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { createClient } from '@supabase/supabase-js';
import { getUsers, getProducts, addUser, updateUser, deleteUser, addProduct, updateProduct, deleteProduct } from './db.js';

const app = express();
const PORT = 3000;

const supabaseUrl = 'https://hfszwgjwistfvqmlpqli.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhmc3p3Z2p3aXN0ZnZxbWxwcWxpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTQ2MTU5NywiZXhwIjoyMDc1MDM3NTk3fQ.2Aj-SZj2kr2Zld63ZIyPxMi4EGOPFB9UQc17FyF3OZ4';
const supabase = createClient(supabaseUrl, supabaseKey);

const upload = multer({ storage: multer.memoryStorage() });

app.use(cors());
app.use(express.json());
app.use(express.static('../'));

app.get('/api/users', (req, res) => {
  res.json(getUsers());
});

app.get('/api/products', (req, res) => {
  res.json(getProducts());
});

app.post('/api/users', (req, res) => {
  const newUser = addUser(req.body);
  res.json(newUser);
});

app.put('/api/users/:id', (req, res) => {
  const updated = updateUser(parseInt(req.params.id), req.body);
  if (updated) {
    res.json(updated);
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

app.delete('/api/users/:id', (req, res) => {
  const deleted = deleteUser(parseInt(req.params.id));
  if (deleted) {
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

app.post('/api/products', (req, res) => {
  const newProduct = addProduct(req.body);
  res.json(newProduct);
});

app.put('/api/products/:id', (req, res) => {
  const updated = updateProduct(parseInt(req.params.id), req.body);
  if (updated) {
    res.json(updated);
  } else {
    res.status(404).json({ error: 'Product not found' });
  }
});

app.delete('/api/products/:id', (req, res) => {
  const deleted = deleteProduct(parseInt(req.params.id));
  if (deleted) {
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'Product not found' });
  }
});

app.post('/api/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const ext = req.file.originalname.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${ext}`;
    
    const { data, error } = await supabase.storage
      .from('askjdlsajd')
      .upload(fileName, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: false
      });

    if (error) {
      console.error('Supabase upload error:', error);
      return res.status(500).json({ error: error.message });
    }

    const imageUrl = `${supabaseUrl}/storage/v1/object/public/askjdlsajd/${fileName}`;
    res.json({ url: imageUrl });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});

