import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // In-memory submissions store
  const submissions: Array<{
    id: string;
    timestamp: string;
    name: string;
    email: string;
    company?: string;
    website?: string;
    services: string[];
    description: string;
    budget?: string;
    timeline?: string;
  }> = [];

  // API endpoint for genuine project enquiries
  app.post('/api/contact', (req, res) => {
    const { name, email, company, website, services, description, budget, timeline } = req.body;

    // Validate required fields
    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ success: false, error: 'Your name is required.' });
    }
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return res.status(400).json({ success: false, error: 'A valid email address is required.' });
    }
    if (!services || !Array.isArray(services) || services.length === 0) {
      return res.status(400).json({ success: false, error: 'Please select at least one service of interest.' });
    }
    if (!description || typeof description !== 'string' || !description.trim()) {
      return res.status(400).json({ success: false, error: 'Project description is required.' });
    }

    const id = `ENQ-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 899 + 100)}`;
    const submission = {
      id,
      timestamp: new Date().toISOString(),
      name: name.trim(),
      email: email.trim(),
      company: company ? String(company).trim() : '',
      website: website ? String(website).trim() : '',
      services,
      description: description.trim(),
      budget: budget || 'Not sure yet',
      timeline: timeline || 'Flexible'
    };

    submissions.push(submission);
    console.log(`[Studio Enquiry Received] Reference: ${id} | Client: ${submission.name} <${submission.email}> | Services: ${services.join(', ')}`);

    return res.status(200).json({
      success: true,
      referenceId: id,
      message: 'Enquiry logged successfully with the studio backend. We will review your project requirements and follow up within 24 hours.',
      receivedAt: submission.timestamp
    });
  });

  app.get('/api/health', (req, res) => {
    res.json({ status: 'active', studio: 'StudioOrbit' });
  });

  // Serve public assets explicitly
  app.use(express.static(path.resolve(__dirname, 'public')));
  app.use('/public', express.static(path.resolve(__dirname, 'public')));

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Studio server active on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
