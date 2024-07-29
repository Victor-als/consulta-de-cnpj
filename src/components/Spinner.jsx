import '../index.css'; 

export function Spinner() {
  return (
      <div className="spinner-container flex flex-col gap-2">
          <div className="spinner "></div>
            <span className='text-white font-bold text-xl'>
              Carregando...
            </span>
      </div>
   );
}
