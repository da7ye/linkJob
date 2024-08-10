import './App.css';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Postjob from './components/Postjob';
import Contactus from './components/Contactus';
import Footer from './components/Footer';
import Cards from './components/Cards';


/* REACT ROUTER */
import { BrowserRouter as Router, Route,Routes, Switch } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import HomeScreen from './screens/HomeScreen';
import Services from './screens/Services';
import WorkersPage from './screens/WorkersPage';
import WorkerProfile from './screens/WorkerProfile';
import LoginPage from './screens/auth/LoginPage';
import SignUp from './screens/auth/SignUp';
import 'react-toastify/dist/ReactToastify.css';
import ResetPassword from './screens/auth/ResetPassword';
import ActivatePage from './screens/auth/ActivatePage';
import ForgotPassword from './screens/auth/ForgotPassword';
import NotfoundPage from './screens/auth/NotfoundPage';
import ProfilePage from './screens/profile/ProfilePage';
import ProviderSignUp from './screens/provider/ProviderSignUp';
import ProviderProfileUpdate from './screens/profile/ProfileUpdatePage';

// test
function App() {
  return (
    <div>
      <Navbar />
      <main className="py-3">
        
          <Routes>
              <Route path="/" element={<HomeScreen />} />
              <Route path="/services" element={<Services />} />
              <Route path="/category/:categoryName" element={<WorkersPage />} />
              <Route path="/workers/:categoryName/:workerName" element={<WorkerProfile />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/providersignup" element={<ProviderSignUp />} />
              <Route path="/providerprofileupdate" element={<ProviderProfileUpdate />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/password/reset/confirm/:uid/:token" element={<ResetPassword />} />
              <Route path="/activate/:uid/:token" element={<ActivatePage />} />
              <Route path="*" element={<NotfoundPage />} />

              {/* Define other routes here */}
            </Routes>
      </main>
      {/* <Hero />
      <Postjob />
      <Contactus />
      <Cards /> */}
      <Footer />
    </div>
  );
}

export default App;
