import FileSaver from "file-saver";

type Params = { [key: string]: any };
type ParamContainer = { name: string; params: Params };
type Preset = Map<string, Params>;
type PresetMap = Map<string, Preset>;
type JSONPreset = { [key: string]: Params };
type JSONPresetMap = { [key: string]: JSONPreset };

export class Arquivo {
  private static preset: Preset = new Map(); // O preset atual
  private static presetMap: PresetMap = new Map(); // Mapa com todos os presets da sessão

  /**
   * Importa um mapa de presets a partir de um arquivo .json
   * @param file O arquivo importado
   * @returns Uma promessa que é rejeitada caso o arquivo seja inválido
   */
  public static async importPresets(file: File): Promise<void> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader(); // Cria um leitor de arquivo

      reader.onload = () => {
        try {
          const obj: JSONPresetMap = JSON.parse(reader.result as string); // Faz o parsing do JSON importado e lança uma excessão se o arquivo não for válido
          const entries: [string, JSONPreset][] = Object.entries(obj); // Cria array de tuplas com os presets em forma de Object
          const presetMap = new Map(); // Cria um novo mapa vazio para armazenar os novos presets

          // Converte e adiciona os presets importados ao mapa
          for (const [key, value] of entries) {
            const preset = new Map(Object.entries(value));
            presetMap.set(key, preset);
          }

          this.presetMap = presetMap; // Atribui o novo mapa ao mapa da classe

          resolve(); // Resolve a promessa
        } catch (e) {
          if (e instanceof Error) {
            console.log("Import failed: " + e.message);
          } else {
            console.log("Unexpected error", e);
          }
          reject(file.name + " is not a valid file."); // Rejeita a promessa
        }
      };
      reader.readAsText(file); // Começa a leitura do arquivo importado
    });
  }
  /**
   * Exporta os presets definidos durante a execução da aplicação
   * para um arquivo .json
   * @param presetNames Lista de presets a serem exportados
   */
  public static exportPresets(presetNames?: string[]): void {
    // Cria o mapa de exportação a partir do mapa de presets ou,
    // se definidos os presets a serem exportados, de um array vazio
    const exportMap: PresetMap = new Map(!presetNames ? this.presetMap : []);

    // Adiciona ao mapa os presets especificados se definidos
    presetNames?.forEach((name) => {
      const preset = this.presetMap.get(name);
      if (preset) exportMap.set(name, preset);
    });

    // Se os presets especificados não existirem lança uma excessão
    if (exportMap.size === 0 && presetNames)
      throw new Error("None of the specified presets were found");

    const file = new File([this.toJSON(exportMap)], "presets.json"); //Cria o arquivo .json

    FileSaver.saveAs(file, "presets.json"); // Inicia o download do arquivo
  }
  /**
   * Retorna os parametros de um dos containers salvos no preset atual
   * @param paramContainerName Nome do container
   * @returns Os parametros do container
   */
  public static loadFromPreset<T = Params>(paramContainerName: string): T {
    const params = this.preset.get(paramContainerName); // Busca o container especificado no mapa

    // Lança uma excessão se o container não existir
    if (params === undefined)
      throw new Error(
        `Param Container "${paramContainerName}" not found or empty`
      );

    return params as T;
  }
  /**
   * Adiciona ou atualiza os parâmetros do container no preset atual
   * @param paramContainer O novo container
   */
  public static saveToPreset(paramContainer: ParamContainer): void {
    const pC = this.preset.get(paramContainer.name); // Busca o container no preset
    const p = { ...(pC ?? {}), ...paramContainer.params }; // Cria novo objeto juntando os parâmetros do container ja existente, se existe, aos do novo
    this.preset.set(paramContainer.name, p); // Cria ou atualiza o container no preset
  }
  /**
   * Salva um preset
   * @param presetName O nome do preset
   */
  public static savePreset(presetName: string, overwrite?: boolean): void {
    // Lança excessão se o preset já existir e overwrite não for verdadeiro
    if (this.presetMap.get(presetName) && !overwrite)
      throw new Error(`Preset ${presetName} already exists`);

    // Cria ou sobrescreve o preset
    this.presetMap.set(presetName, new Map());
  }

  /**
   * Define o preset atual
   * @param presetName O nome do preset
   */
  public static setPreset(presetName: string) {
    const preset = this.presetMap.get(presetName); // Busca o preset no mapa
    if (!preset) throw new Error(`Preset ${presetName} not found`); // Lança excessão se o preset não existir
    this.preset = preset; // Atribui o preset ao preset atual
  }
  /**
   * Getter para os nomes dos presets
   * @returns Array contendo os nomes dos presets
   */
  public static getPresetNames() {
    return [...this.presetMap.keys()];
  }
  /**
   * Converte o Preset ou o Mapa de Presets para o formato json
   * @param obj Um preset ou um mapa de Presets
   * @returns Uma string em formato json
   */
  private static toJSON(obj: Preset | PresetMap): string {
    let str = "";
    if (this.isPreset(obj)) {
      for (const [key, value] of (obj as Preset).entries()) {
        str += `"${key}": ${JSON.stringify(value)},`;
      }
    } else if (this.isPresetMap(obj)) {
      for (const [key, value] of (obj as PresetMap).entries()) {
        str += `"${key}": ${this.toJSON(value)},`;
      }
    } else {
      return JSON.stringify(obj);
    }

    return `{${str}}`.replace(/,}/gim, "}");
  }
  /**
   * Verifica se o objeto é do tipo Preset
   * @param obj Um objeto qualquer
   * @returns Verdadeiro se o objeto for do tipo Preset
   */
  private static isPreset(obj: any): boolean {
    return !(obj.values().next().value instanceof Map);
  }
  /**
   * Verifica se o objeto é do tipo PresetMap
   * @param obj Um objeto qualquer
   * @returns Verdadeiro se o objeto for do tipo PresetMap
   */
  private static isPresetMap(obj: any): boolean {
    return obj.values().next().value instanceof Map;
  }
}
