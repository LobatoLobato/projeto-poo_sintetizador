import FileSaver from "file-saver";
import isElectron from "is-electron";
import * as IData from "models/Data";
import {
  NotAvailableOnBrowserError,
  NotImplementedError,
} from "models/Exceptions";

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
    // Se estiver rodando no electron (desktop)
    // mostra a caixa de diálogo de salvar como, cria o arquivo
    // e salva os presets no caminho especificado
    if (isElectron()) {
      const options: SaveFilePickerOptions = {
        suggestedName: "SynthPreset.json",
        types: [
          {
            description: "Synth presets",
            accept: {
              "text/plain": [".json"],
            },
          },
        ],
      };
      window.showSaveFilePicker(options).then((handle) => {
        this.writeFile(handle, JSONStr);
      });
    }
    // Se estiver no browser cria e inicia o download do arquivo
    else {
      const file = new File([JSONStr], `${fileName}.json`); //Cria o arquivo .json
      FileSaver.saveAs(file, `${fileName}.json`); // Inicia o download do arquivo
    }
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
  /**
   * ! Electron environment specific !
   */
  public async savePresets() {
    throw new NotImplementedError("Arquivo.savePresets");
    // if (!isElectron())
    // throw new NotAvailableOnBrowserError("Arquivo.savePresets");
  }
  /**
   * ! Electron environment specific !
   */
  public async getPreset() {
    throw new NotImplementedError("Arquivo.getPreset");
    // if (!isElectron())
    // throw new NotAvailableOnBrowserError("Arquivo.getPreset");
  }
  /**
   * ! Electron environment specific !
   */
  public async savePreset() {
    throw new NotImplementedError("Arquivo.savePreset");
    // if (!isElectron())
    // throw new NotAvailableOnBrowserError("Arquivo.savePreset");
  }
  /**
   * ! Electron environment specific !
   */
  public async deletePreset() {
    throw new NotImplementedError("Arquivo.deletePreset");
    // if (!isElectron())
    // throw new NotAvailableOnBrowserError("Arquivo.deletePreset");
  }

  /**
   * ! Electron environment specific !
   */
  private async writeFile(
    fileHandle: FileSystemFileHandle,
    contents: FileSystemWriteChunkType
  ) {
    if (!isElectron())
      throw new NotAvailableOnBrowserError("Arquivo.writeFile");
    // Create a FileSystemWritableFileStream to write to.
    const writable = await fileHandle.createWritable();
    // Write the contents of the file to the stream.
    await writable.write(contents);
    // Close the file and write the contents to disk.
    await writable.close();
  }
}

export const FILE_HANDLER = new FileHandler();
