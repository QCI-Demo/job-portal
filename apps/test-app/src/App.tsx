import { useState } from 'react';
import {
  NavBar,
  DataTable,
  FormInput,
  Button,
  Modal,
  ChartContainer,
} from '@jobportal/dashboard-ui';
import '@jobportal/dashboard-ui/styles.css';

const jobData = [
  { id: 1, title: 'Software Engineer', status: 'Active', applicants: 24 },
  { id: 2, title: 'Product Manager', status: 'Draft', applicants: 0 },
  { id: 3, title: 'UX Designer', status: 'Active', applicants: 12 },
];

const columns = [
  { key: 'title', header: 'Job Title' },
  { key: 'status', header: 'Status' },
  { key: 'applicants', header: 'Applicants' },
];

function App() {
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState('');

  return (
    <div className="dashboard-ui" style={{ minHeight: '100vh', background: 'var(--dashboard-bg)' }}>
      <NavBar
        brand="Dashboard UI Test"
        items={[
          { label: 'Overview', href: '#', isActive: true },
          { label: 'Jobs', href: '#' },
          { label: 'Settings', href: '#' },
        ]}
        userName="Test User"
        onLogout={() => alert('Logged out')}
      />

      <main style={{ padding: 24, maxWidth: 1200, margin: '0 auto' }}>
        <h1 style={{ marginBottom: 24 }}>Component Library Verification</h1>

        <section style={{ marginBottom: 32 }}>
          <h2>Form Input & Buttons</h2>
          <div style={{ display: 'flex', gap: 16, alignItems: 'flex-end', marginTop: 12 }}>
            <FormInput
              label="Email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ maxWidth: 300 }}
            />
            <Button variant="primary" onClick={() => setShowModal(true)}>
              Open Modal
            </Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="danger">Danger</Button>
          </div>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2>Data Table</h2>
          <div style={{ marginTop: 12 }}>
            <DataTable columns={columns} data={jobData} />
          </div>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2>Chart Container</h2>
          <ChartContainer
            title="Applications Over Time"
            subtitle="Last 30 days"
            actions={
              <Button size="sm" variant="secondary">
                Export
              </Button>
            }
          >
            <div
              style={{
                width: '100%',
                height: 200,
                background: 'linear-gradient(135deg, #e0e7ff, #c7d2fe)',
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#4338ca',
              }}
            >
              Chart Placeholder
            </div>
          </ChartContainer>
        </section>
      </main>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Test Modal"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => setShowModal(false)}>
              Confirm
            </Button>
          </>
        }
      >
        <p>This modal confirms the library is installed and working correctly.</p>
      </Modal>
    </div>
  );
}

export default App;
