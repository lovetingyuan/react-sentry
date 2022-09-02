import React from 'react';
import './style.css';
import { Routes, Route, Link } from 'react-router-dom';
import * as Sentry from '@sentry/react';

const SentryRoutes = Sentry.withSentryReactRouterV6Routing(Routes);

// App.js
function Home() {
  return (
    <>
      <main>
        <h2>Welcome to the homepage!</h2>
        <p>You can do this, I believe in you.</p>
      </main>
      <nav>
        <Link to="/about">About</Link>
      </nav>
    </>
  );
}

function About() {
  return (
    <>
      <main>
        <h2>Who are we?</h2>
        <p>That feels like an existential question, don't you think?</p>
      </main>
      <nav>
        <Link to="/">Home</Link>
      </nav>
    </>
  );
}
export default function App() {
  return (
    <div>
      <h1>Hello StackBlitz and Sentry!</h1>
      <p>Start editing to see some magic happen :)</p>
      <SentryRoutes>
        <Route path="/" element={<Home />} />
        <Route path="about" element={<About />} />
      </SentryRoutes>
      {/* <Routes>
        <Route path="/" element={<Home />} />
        <Route path="about" element={<About />} />
      </Routes> */}
    </div>
  );
}
