// src/app/[section]/[...slug]/page.tsx
import Navbar from '../../components/Navbar/Navbar'
import UnderConstruction from '../../components/UnderConstruction/UnderConstruction'

export default function GenericPage() {
  return (
    <>
      <Navbar />
      <UnderConstruction />
    </>
  )
}