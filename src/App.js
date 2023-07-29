import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
    const apiHost = process.env.REACT_APP_API_HOST;

    const [data, setData] = useState({
        receitas: 0,
        despesas: 0,
        valor_total: 0,
        extrato: []
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [showForm, setShowForm] = useState(false);

    const fetchData = async (term) => {
        const response = await fetch(`${apiHost}/api/caixas?tipo=${term}`);
        const jsonData = await response.json();
        setData(jsonData);
    };

    useEffect(() => {
        fetchData(searchTerm);
    }, [searchTerm]);

    const handleDelete = async (id) => {
        if (window.confirm('Confirma?')) {
            await fetch(`${apiHost}/api/caixas/${id}`, {
                method: 'DELETE'
            });
            // Refresh data
            fetchData(searchTerm);
        }
    };

    const handleAddClick = () => {
        setShowForm(true);
    };
  
    const handleSearch = (event) => {
        event.preventDefault();
        setSearchTerm(event.target.elements.search.value);
    };

    const handleSubmit = async (event) => {
      event.preventDefault();
  
      // Create FormData object
      let formData = new FormData(event.target);
      let formObject = {};
  
      // Convert FormData to JSON
      for (let [key, value] of formData.entries()) {
          formObject[key] = value;
      }
  
      await fetch(`${apiHost}/api/caixas`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(formObject)
      });
      setShowForm(false);
      fetchData(searchTerm);
  };

    return (
        <div className="container">
            <h1>Fluxo de caixa em PHP</h1>
            <hr />
            <div className="row dvCaixa">
                <div className="col">
                    <h4>Valor Total</h4>
                    <div>R$ {data.valor_total.toFixed(2)}</div>
                </div>
                <div className="col">
                    <h4>Receitas</h4>
                    <div>R$ {data.receitas.toFixed(2)}</div>
                </div>
                <div className="col">
                    <h4>Despesas</h4>
                    <div>R$ {data.despesas.toFixed(2)}</div>
                </div>
            </div>
            <hr />
            <form onSubmit={handleSearch}>
                <div className="row dvBusca">
                    <div className="col-md-10">
                        <div className="input-group mb-3">
                            <input type="text" className="form-control" name="search" placeholder="Digite algo..." />
                            <div className="input-group-append">
                                <button type="submit" className="btn btn-outline-secondary">Buscar</button>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-2">
                        <button onClick={handleAddClick} className="btn btn-primary">Adicionar</button>
                    </div>
                </div>
            </form>
            <hr />
            {showForm && (
                <div className="dvCadastro">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="tipo" className="form-label">Tipo</label>
                            <input type="text" className="form-control" id="tipo" name="tipo" required />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="valor" className="form-label">Valor</label>
                            <input type="number" step="0.01" className="form-control" id="valor" name="valor" required />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="status" className="form-label">Status</label>
                            <select className="form-select" id="status" name="status" required>
                                <option value="1">Receita</option>
                                <option value="0">Despesa</option>
                            </select>
                        </div>
                        <button type="submit" className="btn btn-primary">Adicionar</button>
                        <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancelar</button>
                    </form>
                </div>
            )}
            <hr />
            
            <div className="row dvTabela">
              <table>
                    <thead>
                        <tr>
                            <th scope="col">Tipo</th>
                            <th scope="col">Valor</th>
                            <th scope="col">Status</th>
                            <th scope="col"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.extrato.map((item) => (
                            <tr key={item.id}>
                                <td>{item.tipo}</td>
                                <td>R$ {item.valor.toFixed(2)}</td>
                                <td style={{background: item.status === 1 ? '#81c0ff' : 'red'}}>{item.status === 1 ? 'Receita' : 'Despesa'}</td>
                                <td style={{width: '20px'}}>
                                    <button onClick={() => handleDelete(item.id)} className="btn btn-danger">Excluir</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default App;
