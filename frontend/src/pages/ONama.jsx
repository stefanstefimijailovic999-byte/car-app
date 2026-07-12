import Navbar from '../components/Navbar';

function ONama() {
  return (
    <div className="min-h-screen bg-background text-text">
      <Navbar />
      <div className="max-w-2xl mx-auto px-6 py-16">
        <p className="text-primary text-sm tracking-widest font-medium mb-3">O NAMA</p>
        <h1 className="font-display text-3xl font-bold mb-6">
          Digitalno tržište vozila, napravljeno jednostavno
        </h1>

        <div className="space-y-4 text-text-muted text-sm leading-relaxed">
          <p>
            carVector je platforma koja povezuje kupce i prodavce polovnih i novih automobila
            na jednom mestu, bez posrednika i bez nepotrebne komplikacije.
          </p>
          <p>
            Naš cilj je da pretraga i objavljivanje oglasa budu brzi, jasni i pouzdani —
            sa naprednim filtriranjem, direktnom komunikacijom između kupaca i prodavaca,
            i transparentnim prikazom svih relevantnih podataka o vozilu.
          </p>
          <p>
            Platforma je razvijena kao projekat u okviru predmeta Veb tehnologije,
            sa fokusom na moderan dizajn i punu funkcionalnost — od registracije i
            autentifikacije, preko upravljanja oglasima, do razmene poruka i administracije.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-10">
          {[
            ['Sigurno', 'JWT autentifikacija i zaštićeni nalozi'],
            ['Brzo', 'Napredna pretraga i filtriranje u realnom vremenu'],
            ['Direktno', 'Komunikacija sa prodavcima bez posrednika'],
          ].map(([naslov, opis]) => (
            <div key={naslov} className="bg-white/[0.03] border border-white/10 rounded-xl p-4">
              <p className="font-display font-medium text-primary text-sm mb-1">{naslov}</p>
              <p className="text-text-muted text-xs">{opis}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ONama;