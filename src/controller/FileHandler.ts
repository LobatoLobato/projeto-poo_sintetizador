import FileSaver from "file-saver";
import * as IData from "models/data";

import { PresetMap } from "./PresetManager";

type JSONPreset = { [key: string]: IData.PresetParamContainer };
type JSONPresetMap = { [key: string]: JSONPreset };

export class FileHandler {
  /**
   * Exporta um arquivo .json a partir de uma string de objeto em formato JSON
   * @param fileName O nome do arquivo
   * @param JSONStr A string do objeto em formato JSON
   */
  public async exportJSON(JSONStr: string, fileName: string): Promise<void> {
    // Verifica se a string é válida e se não for lança uma excessão
    try {
      JSON.parse(JSONStr);
    } catch (e) {
      throw new Error("JSON inválido");
    }
    const file = new File([JSONStr], `${fileName}.json`); //Cria o arquivo .json
    FileSaver.saveAs(file, `${fileName}.json`); // Inicia o download do arquivo
  }
  /**
   * Importa um mapa de presets a partir de um arquivo .json
   * @param file O arquivo importado
   * @returns Uma promessa que resolve com o mapa de presets e é rejeitada caso o arquivo seja inválido
   */
  public async importPresets(file: File): Promise<PresetMap> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader(); // Cria um leitor de arquivo
      // Se o arquivo importado não for do tipo .json rejeita a promessa e retorna
      if (!/.*?\.json/i.test(file.name)) {
        reject(`Import failed: ${file.name} is not a valid file.`);
        return;
      }

      reader.onload = () => {
        try {
          const obj: JSONPresetMap = JSON.parse(reader.result as string); // Faz o parsing do JSON importado e lança uma excessão se o arquivo não for válido
          const entries: [string, JSONPreset][] = Object.entries(obj); // Cria array de tuplas com os presets em forma de Object
          const presetMap: PresetMap = new Map(); // Cria um novo mapa vazio para armazenar os novos presets

          // Converte e adiciona os presets importados ao mapa
          for (const [key, value] of entries) {
            const preset = new Map(Object.entries(value));
            presetMap.set(key, preset);
          }

          resolve(presetMap); // Resolve a promessa com o mapa de presets importado
        } catch (e) {
          if (e instanceof Error) {
            console.log("Import failed: " + e.message);
          } else {
            console.log("Unexpected error", e);
          }
          reject(`Import failed: ${file.name}'s content is not valid JSON.`); // Rejeita a promessa
        }
      };
      reader.readAsText(file); // Começa a leitura do arquivo importado
    });
  }
}

export const FILE_HANDLER = new FileHandler();
