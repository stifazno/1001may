// components/UploadProductForm.js
import { useState } from 'react';

export default function UploadProductForm() {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage('Пожалуйста, выберите файл');
      return;
    }

    setIsUploading(true);
    setMessage('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/products/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setMessage('Товары успешно добавлены!');
      } else {
        setMessage('Ошибка при добавлении товаров');
      }
    } catch (error) {
      setMessage('Ошибка при загрузке файла');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <h2>Загрузить товары через Excel</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} accept=".xlsx, .xls" />
        <button type="submit" disabled={isUploading}>Загрузить</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
