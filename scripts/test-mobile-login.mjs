import jwt from 'jsonwebtoken';

const SECRET = process.env.NEXTAUTH_SECRET || 'dev-secret';
const user = { id: '1', name: 'Alice Landlord', email: 'alice@demo.com', role: 'landlord' };

const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, SECRET, { expiresIn: '7d' });
console.log(JSON.stringify({ token, user }, null, 2));

// also print decoded payload to verify
const decoded = jwt.verify(token, SECRET);
console.log('\nDecoded payload:\n', decoded);
