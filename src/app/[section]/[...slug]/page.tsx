// src/app/[section]/[...slug]/page.tsx
import Navbar from '../../components/navbar/Navbar'
import UnderConstruction from '../../components/underconstruction/UnderConstruction'

export default function GenericPage() {
  return (
    <>
      <Navbar />
      <UnderConstruction />
    </>
  )
}