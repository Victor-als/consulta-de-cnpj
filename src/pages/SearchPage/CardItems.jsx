import '../../index.css';

//eslint-disable-next-line react/prop-types
export function CardItems({ editValues, handleInputChange, handleEdit, handleSave, isEditing  }) {
  const fields = [
    { label: 'Nome', key: 'nome_fantasia' },
    { label: 'Razão social', key: 'razao_social' },
    { label: 'Data de abertura', key: 'data_inicio_atividade' },
    { label: 'Situação', key: 'descricao_situacao_cadastral' },
    { label: 'Telefone', key: 'ddd_telefone_1' },
    { label: 'Endereço', key: 'endereco' },
    { label: 'Email', key: 'email' },
  ];
  
  return (
    <form className="bg-zinc-800 p-5 shadow-shape rounded-lg mb-14">
      <h2 className="text-white font-semibold text-2xl mb-4">Detalhes do CNPJ:</h2>
      {fields.map((field) => (
        <div key={field.key} className="mb-4">
          <label className=" text-zinc-200 block mb-2"><strong>{field.label}:</strong></label>
          {isEditing ? (
            <input 
              className="bg-zinc-700 text-white p-2 rounded-md w-full"
              type="text"
              name={field.key}
              value={editValues[field.key] || ''}
              onChange={handleInputChange}
            />
          ) : (
            <p className='text-white'>{editValues[field.key]}</p>
          )}
        </div>
      ))}
      {isEditing ? (
        <button 
         type="button" 
         onClick={handleSave} 
         className="mt-4 font-semibold 
         p-3 rounded-md text-white shadow-shape bg-lime-600 hover:bg-opacity-85">
          Salvar
        </button>
      ) : (
        <button 
        className="mt-4 font-semibold p-3 rounded-md text-white shadow-shape
         bg-lime-600 hover:bg-opacity-85"
        type="button" 
        onClick={handleEdit} 
       >
         Editar dados
       </button>
     )}
   </form>
  );
}


//bg-zinc-800 p-5 shadow-shape rounded-lg mb-14