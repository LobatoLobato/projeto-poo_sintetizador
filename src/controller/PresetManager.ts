import * as IData from "models/data";

type Preset = Map<string, IData.PresetParamContainer>;
export type PresetMap = Map<string, Preset>;

export class PresetManager {
  private currPresetName: string = "Default";
  private currPreset: Preset = new Map(); // O preset atual, começa com o preset padrão
  private readonly defaultPresetOBJ: IData.IDataInterfaces = {
    LFOParams: {
      discriminator: "LFOParams",
      type: "sine",
      rateEnvelope: {
        amount: 0,
        attack: 0,
        decay: 0,
        sustain: 1,
        release: 0,
      },
      ampEnvelope: {
        amount: 0.5,
        attack: 0,
        decay: 0,
        sustain: 1,
        release: 0,
      },
    },
    OscillatorParams: {
      discriminator: "OscillatorParams",
      type: "sine",
      pitchOffset: 0,
      detune: 0,
      lfoDepth: 0,
      unison: {
        size: 0,
        detune: 0,
        spread: 0,
      },
      envelope: {
        amount: 0.5,
        attack: 0,
        decay: 0,
        sustain: 0,
        release: 0,
      },
    },
    AmplifierParams: {
      discriminator: "AmplifierParams",
      envelope: {
        amount: 0.22,
        attack: 0,
        decay: 0,
        sustain: 1,
        release: 0,
      },
      lfoDepth: 0,
    },
    FilterParams: {
      discriminator: "FilterParams",
      type: "lowpass",
      slope: "-12dB",
      cutoffFrequency: 20000,
      Q: -10,
      lfoDepth: 0,
      driveAmount: 0,
      envelope: {
        amount: 0,
        attack: 0,
        decay: 0,
        sustain: 0,
        release: 0,
      },
    },
  };
  private defaultPreset: Preset = new Map(
    Object.entries(this.defaultPresetOBJ)
  );
  constructor() {
    localStorage.setItem(this.currPresetName, this.toJSON(this.defaultPreset));
    this.setPreset(this.currPresetName);
  }

  /**
   * Adiciona ou atualiza os parâmetros do container no preset atual
   * @param params Os parametros do container
   */
  public saveToCurrentPreset<T extends IData.PresetParamContainer>(
    params: T
  ): void {
    // Busca o container do tipo de parametros passados no preset padrão
    const defaultParams = this.defaultPreset.get(
      params.discriminator
    ) as Record<string, any>;

    // Cria o container a partir dos parametros passados
    const paramData = Object.keys(defaultParams).reduce((acc, key) => {
      let param: any = defaultParams[key];
      const pValue = (params as Record<string, any>)[key];

      if (typeof pValue === "string") param = pValue;
      else if (typeof pValue === "number") param = pValue;
      else if (typeof pValue === "boolean") param = pValue;
      else if (pValue) param = { ...defaultParams[key], ...pValue };

      return { ...acc, [key]: param };
    }, defaultParams as T);

    this.currPreset.set(params.discriminator, paramData); // Cria ou atualiza o container no preset

    localStorage.setItem(this.currPresetName, this.toJSON(this.currPreset));
  }
  /**
   * Retorna os parametros de um dos containers salvos no preset atual
   * @param paramContainerName Nome do container
   * @returns Os parametros do container
   */
  public loadFromCurrentPreset<T extends keyof IData.IDataInterfaces>(
    paramContainerName: T
  ): IData.IDataInterfaces[T] {
    const params = this.currPreset.get(paramContainerName); // Busca o container especificado no mapa
    // Lança uma excessão se o container não existir
    if (params === undefined)
      throw new Error(
        `Param Container "${paramContainerName}" not found or empty`
      );

    return params as IData.IDataInterfaces[T];
  }
  /**
   * Salva um preset
   * @param presetName O nome do preset
   */
  public savePreset(presetName: string, overwrite?: boolean): void {
    // Lança excessão se o preset já existir e overwrite não for verdadeiro
    if (localStorage.getItem(presetName) && !overwrite)
      throw new Error(`Preset ${presetName} already exists`);
    // Cria ou sobrescreve o preset
    localStorage.setItem(presetName, JSON.stringify({}));
  }
  /**
   * Deleta um preset
   */
  public deletePreset(presetName: string): void {
    if (!localStorage.getItem(presetName))
      throw new Error(`Preset ${presetName} does not exist`);
    else if (presetName === "Default")
      throw new Error(`Default preset cannot be deleted`);

    localStorage.removeItem(presetName);
  }
  /**
   * Define o preset atual
   * @param presetName O nome do preset
   */
  public setPreset(presetName: string) {
    const preset = localStorage.getItem(presetName); // Busca o preset no mapa
    if (!preset) throw new Error(`Preset ${presetName} not found`); // Lança excessão se o preset não existir
    this.currPreset = new Map(Object.entries(JSON.parse(preset))); // Atribui o preset ao preset atual
    this.currPresetName = presetName;
  }
  /**
   * Getter para os nomes dos presets
   * @returns Array contendo os nomes dos presets
   */
  public getPresetNames() {
    return Object.keys(localStorage);
  }
  /**
   * Substitui o mapa de presets armazenado pelo mapa passado
   * (adiciona o preset padrão ao mapa passado como parâmetro)
   * @param map Mapa de presets
   */
  public setPresetMap(map: PresetMap) {
    Object.keys(localStorage).forEach((key) => {
      localStorage.removeItem(key);
    });
    const convMap: { [key: string]: Preset } = JSON.parse(this.toJSON(map));
    Object.entries(convMap).forEach(([key, value]) => {
      localStorage.setItem(key, JSON.stringify(value));
    });
    localStorage.setItem("Default", this.toJSON(this.defaultPreset));
  }
  /**
   * Adiciona os presets do mapa de preset passado ao mapa armazenado
   * (adiciona o preset padrão ao mapa passado como parâmetro)
   * @param map Mapa de presets
   */
  public mergePresetMap(map: PresetMap, overwrite?: boolean) {
    const convMap: { [key: string]: Preset } = JSON.parse(this.toJSON(map));
    Object.entries(convMap).forEach(([key, value]) => {
      if (!overwrite) {
        const exists = localStorage.getItem(key);
        !exists && localStorage.setItem(key, JSON.stringify(value));
      } else {
        localStorage.setItem(key, JSON.stringify(value));
      }
    });
    localStorage.setItem("Default", this.toJSON(this.defaultPreset));
  }
  /**
   * Retorna o mapa de presets com todos os presets ou
   * com os presets definidos pelo array de nomes
   * @param presetNames Array com nomes de presets a serem retornados no mapa
   * @returns Um mapa de presets
   */
  public getPresetMap(presetNames?: string[]): PresetMap {
    // Cria um mapa a partir do mapa de presets ou,
    // se definidos os presets a serem exportados, de um array vazio
    const presetMap = new Map();
    Object.entries(localStorage).forEach(([key, value]) => {
      presetMap.set(key, JSON.parse(value));
    });
    const map: PresetMap = new Map(!presetNames ? presetMap : []);

    // Adiciona ao mapa os presets especificados se definidos
    presetNames?.forEach((name) => {
      const preset = presetMap.get(name);
      if (preset) map.set(name, preset);
    });

    return map;
  }
  /**
   * Retorna o mapa de presets com todos os presets ou
   * com os presets definidos pelo array de nomes em formato JSON
   * @param presetNames Array com nomes de presets a serem retornados no mapa
   * @returns Um JSON do mapa de presets
   */
  public getPresetMapAsJSON(presetNames?: string[]): string {
    return this.toJSON(this.getPresetMap(presetNames));
  }
  /**
   * Converte o Preset ou o Mapa de Presets para o formato json
   * @param obj Um preset ou um mapa de Presets
   * @returns Uma string em formato json
   */
  private toJSON(obj: Preset | PresetMap): string {
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
  private isPreset(obj: any): boolean {
    return !(obj.values().next().value instanceof Map);
  }
  /**
   * Verifica se o objeto é do tipo PresetMap
   * @param obj Um objeto qualquer
   * @returns Verdadeiro se o objeto for do tipo PresetMap
   */
  private isPresetMap(obj: any): boolean {
    return obj.values().next().value instanceof Map;
  }
}

export const PRESET_MANAGER = new PresetManager();