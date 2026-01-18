import { Card } from '../wireframe-primitives/Card';
import { Divider } from '../wireframe-primitives/Divider';

export default function Home() {
  return (
    <main>
      <h1>Wireframe Kit</h1>
      <p>A minimal prototyping environment for UX experiments.</p>

      <Divider />

      <Card>
        <h2>Experiments</h2>
        <ul>
          <li>
            <a href="/experiments/agentic-hero">Agentic Hero (Steady State)</a>
            <ul style={{ marginTop: '8px', fontSize: '14px' }}>
              <li><a href="/experiments/agentic-hero/security">Security Incident</a></li>
              <li><a href="/experiments/agentic-hero/whistleblower">Whistleblower Report</a></li>
              <li><a href="/experiments/agentic-hero/compliance">Global Compliance</a></li>
            </ul>
          </li>
          <li style={{ marginTop: '12px' }}>
            <a href="/experiments/ca-books">CA Books</a>
            <span style={{ fontSize: '12px', color: '#737373', marginLeft: '8px' }}>
              — List view with search, filter, detail panel
            </span>
          </li>
          <li style={{ marginTop: '8px' }}>
            <a href="/experiments/ca-bookbuilder">CA Book Builder</a>
            <span style={{ fontSize: '12px', color: '#737373', marginLeft: '8px' }}>
              — Editor with smart builder assist nudge
            </span>
          </li>
        </ul>
      </Card>
    </main>
  );
}
