import { useState, useEffect } from "react";
import { CardItems } from "./CardItems";
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Spinner } from "../../components/Spinner";
import "../../index.css";

export function SearchPage() {
  const [cnpj, setCNPJ] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [editValues, setEditValues] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showCard, setShowCard] = useState(false);

  useEffect(() => {
    // Carregar dados do localStorage quando o componente for montado
    const savedData = localStorage.getItem('editValues');
    const savedResult = localStorage.getItem('result');
    if (savedData) {
      setEditValues(JSON.parse(savedData));
    }
    if (savedResult) {
      setResult(JSON.parse(savedResult));
      setShowCard(true); // Mostrar o card se houver resultado salvo
    }
  }, []);

  useEffect(() => {
    // Salvar dados no localStorage sempre que editValues mudar
    if (Object.keys(editValues).length > 0) {
      localStorage.setItem('editValues', JSON.stringify(editValues));
    }
  }, [editValues]);

  useEffect(() => {
    // Salvar resultado no localStorage sempre que o resultado mudar
    if (result) {
      localStorage.setItem('result', JSON.stringify(result));
    }
  }, [result]);

  const formatDate = (dateString) => {
    try {
      const parsedDate = parseISO(dateString); // Converte a string ISO para um objeto Date
      return format(parsedDate, 'dd/MM/yyyy', { locale: ptBR }); // Formata a data
    } catch (error) {
      return ''; // Retorna uma string vazia se a data não puder ser analisada
    }
  };

  const buscarCNPJ = async () => {
    setError('');
    setResult(null);
    setEditValues({});
    setIsEditing(false);
    setLoading(true);
    setShowCard(false);

    const cnpjCleaned = cnpj.replace(/\D/g, ''); // Remove caracteres não numéricos

    if (!cnpjCleaned) {
      setError('Por favor, insira um CNPJ.');
      setLoading(false);
      return;
    }

    const url = `https://brasilapi.com.br/api/cnpj/v1/${cnpjCleaned}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Erro: ${response.status}`);
      }
      const data = await response.json();
      if (data.error) {
        setError(`Erro: ${data.error}`);
      } else {
        setResult(data);
        setEditValues({
          nome_fantasia: data.nome_fantasia || '',
          razao_social: data.razao_social || '',
          data_inicio_atividade: formatDate(data.data_inicio_atividade) || '',
          descricao_situacao_cadastral: data.descricao_situacao_cadastral || '',
          ddd_telefone_1: data.ddd_telefone_1 || '',
          endereco: `${data.logradouro || ''}, ${data.numero || ''} - ${data.bairro || ''}, ${data.municipio || ''} - ${data.uf || ''}, ${data.cep || ''}`,
          email: data.email || ''
        });
      }
      setTimeout(() => {
        setShowCard(true);
        setLoading(false);
      }, 2000); // Atraso de 2 segundos antes de mostrar o card
    } catch (error) {
      setError(`Erro ao buscar CNPJ: ${error.message}`);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditValues({ ...editValues, [name]: value });
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    console.log("Dados submetidos:", editValues);
    setIsEditing(false);
    // Aqui você pode adicionar a lógica para enviar os dados para uma API ou processá-los conforme necessário
  };

  return (
    <>
    <main className="flex flex-col items-center p-4 min-h-screen">
      <div className="mt-10 max-w-4xl w-full">
        <h1 className="text-gray-100 text-4xl font-semibold mb-8 text-center">Consulte um CNPJ</h1>
        <div className="flex justify-center flex-col sm:flex-row gap-2">
          <input 
            className="bg-zinc-700 text-white p-3 rounded-md sm:w-2/3 lg:w-3/4 shadow-lg"
            type="text" 
            onChange={(e) => setCNPJ(e.target.value)}
            placeholder="Informe um CNPJ..." 
          />
          <button 
            onClick={buscarCNPJ}
            className="font-semibold p-3 rounded-md text-white shadow-lg bg-lime-600 hover:bg-lime-700 w-full sm:w-auto">
            Pesquisar
          </button>
        </div>

        {error && <p className="text-red-500 mt-4">{error}</p>}
        {loading && <Spinner />}
        {showCard && result && (
          <div className="mt-10 p-6">
            <CardItems
              editValues={editValues} 
              handleInputChange={handleInputChange} 
              handleEdit={handleEdit} 
              handleSave={handleSave} 
              isEditing={isEditing} 
            />
          </div>
        )}
      </div>
    </main>
    </>
  );
}