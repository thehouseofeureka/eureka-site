// src/app/components/UnderConstruction.tsx
export default function UnderConstruction() {
    return (
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        fontSize: '30px',
        transform: 'translate(-50%, -50%)',
        fontFamily: 'Georgia, serif',
        color: '#171717',
        textAlign: 'center',
        lineHeight: '1.5'
      }}>
        This page is under construction.
        <br />
        Finished pages will be announced on Instagram.
      </div>
    )
  }