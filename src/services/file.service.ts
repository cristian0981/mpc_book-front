import api from '@/api/axios';

/**
 * Interfaz para la respuesta de subida de archivo
 */
export interface UploadFileResponse {
  secureUrl: string;
}

/**
 * Servicio para manejar operaciones de archivos
 */
export class FileService {
  /**
   * Sube una imagen de libro al servidor
   * @param file - Archivo de imagen a subir
   * @returns Promise con la URL segura del archivo subido
   */
  static async uploadBookImage(file: File): Promise<UploadFileResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/files/books', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data.data;
  }

  /**
   * Obtiene la URL completa de una imagen de libro
   * @param bookName - Nombre del archivo de imagen (incluyendo extensión)
   * @returns URL completa para acceder a la imagen
   */
  static getBookImageUrl(bookName: string): string {
    // Asumiendo que la URL base de la API está configurada en axios
    return `${api.defaults.baseURL}/files/books/${bookName}`;
  }

  /**
   * Descarga una imagen de libro
   * @param bookName - Nombre del archivo de imagen
   * @returns Promise con el blob de la imagen
   */
  static async downloadBookImage(bookName: string): Promise<Blob> {
    const response = await api.get(`/files/books/${bookName}`, {
      responseType: 'blob',
    });

    return response.data;
  }

 

  /**
   * Obtiene información sobre las restricciones de archivos
   * @returns Objeto con información sobre tipos y tamaños permitidos
   */
  static getFileRestrictions() {
    return {
      allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'],
      maxSize: 5 * 1024 * 1024, // 5MB
      maxSizeFormatted: '5MB',
      allowedExtensions: ['.jpg', '.jpeg', '.png', '.gif']
    };
  }
}

// Exportar funciones individuales para mayor flexibilidad
export const uploadBookImage = FileService.uploadBookImage;
export const getBookImageUrl = FileService.getBookImageUrl;
export const downloadBookImage = FileService.downloadBookImage;
// export const validateImageFile = FileService.validateImageFile;
export const getFileRestrictions = FileService.getFileRestrictions;