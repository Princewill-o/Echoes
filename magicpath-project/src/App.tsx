import { useMemo } from 'react';
import { Container, Theme } from './settings/types';
import { Echoes } from './components/generated/Echoes';

let theme: Theme = 'dark';
// only use 'centered' container for standalone components, never for full page apps or websites.
let container: Container = 'none';

function App() {
  // Theme is now managed internally by the Echoes component
  // We keep this stub in case external theme needs are added later
  void theme;

  const generatedComponent = useMemo(() => {
    return <Echoes />;
  }, []);

  if (container === 'centered') {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center">
        {generatedComponent}
      </div>
    );
  } else {
    return generatedComponent;
  }
}

export default App;