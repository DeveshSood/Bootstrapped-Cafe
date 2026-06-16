import React from 'react';
import Hero from '../components/Hero/Hero';
import ReelCarousel from '../components/ReelCarousel/ReelCarousel';
import MenuPreview from '../components/MenuPreview/MenuPreview';
import Coworking from '../components/Coworking/Coworking';
import HowWeCook from '../components/HowWeCook/HowWeCook';
import SignatureMeals from '../components/SignatureMeals/SignatureMeals';
import Membership from '../components/Membership/Membership';
import Testimonials from '../components/Testimonials/Testimonials';
import Footer from '../components/Footer/Footer';
import CurvedDivider from '../components/common/CurvedDivider';
import { useCart } from '../components/Cart/CartContext';

const HomePage = () => {
  const { addItem } = useCart();

  return (
    <main>
      <Hero />
      <ReelCarousel />
      <CurvedDivider topColor="var(--white)" bottomColor="var(--warm-cream)" direction="down" />
      <MenuPreview />
      <Coworking />
      <CurvedDivider topColor="var(--warm-cream)" bottomColor="var(--forest-green)" direction="down" />
      <HowWeCook />
      <CurvedDivider topColor="var(--warm-cream)" bottomColor="var(--white)" direction="down" />
      <SignatureMeals />
      <CurvedDivider topColor="var(--white)" bottomColor="var(--warm-cream)" direction="down" />
      <Membership />
      <CurvedDivider topColor="var(--warm-cream)" bottomColor="var(--white)" direction="down" />
      <Testimonials />
      <Footer />
    </main>
  );
};

export default HomePage;
