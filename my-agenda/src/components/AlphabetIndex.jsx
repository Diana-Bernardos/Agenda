import './App.css';

const AlphabetIndex = () => {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    
    return (
      <div className="alphabet-index">
        {alphabet.map(letter => (
          <div key={letter} className="letter">
            {letter}
          </div>
        ))}
      </div>
    );
  };

  export default AlphabetIndex;