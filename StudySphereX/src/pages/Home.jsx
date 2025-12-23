import { BenefitsSection } from '../components/HomePage/BenefitsSection'
import { CallToAction } from '../components/HomePage/CallToAction'
import { FeaturedCourses } from '../components/HomePage/FeaturedCourses'
import { Hero } from '../components/HomePage/Hero'
import { PopularCourses } from '../components/HomePage/PopularCourses'
import { Working } from '../components/HomePage/Working'

export const Home = () => {
  return (
    <>
     <Hero />
    <Working />
    <PopularCourses />
    <FeaturedCourses />
    <BenefitsSection />
    <CallToAction />
    </>
   
  )
}
