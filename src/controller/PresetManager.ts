import * as IData from "models/Data";

type Preset = Map<string, IData.PresetParamContainer>;
export type PresetMap = Map<string, Preset>;

export class PresetManager {
  private preset: Preset = new Map(); // O preset atual, começa com o preset padrão
  private presetMap: PresetMap = new Map(); // Mapa com todos os presets da sessão
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
      Q: 0,
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
    this.presetMap.set("Default", this.defaultPreset);
    this.setPreset("Default");
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
    const paramData = Object.entries(params).reduce((acc, [key, value]) => {
      const param = value ?? defaultParams[key];
      return { ...acc, [key]: param };
    }, {} as T);
    const paramName = params.discriminator
      .toLowerCase()
      .replace("params", " parameters");
    console.log(`Saving ${paramName}`);
    this.preset.set(params.discriminator, paramData); // Cria ou atualiza o container no preset
  }
  /**
   * Retorna os parametros de um dos containers salvos no preset atual
   * @param paramContainerName Nome do container
   * @returns Os parametros do container
   */
  public loadFromCurrentPreset<T extends keyof IData.IDataInterfaces>(
    paramContainerName: T
  ): IData.IDataInterfaces[T] {
    const params = this.preset.get(paramContainerName); // Busca o container especificado no mapa
    // Lança uma excessão se o container não existir
    if (params === undefined)
      throw new Error(
        `Param Container "${paramContainerName}" not found or empty`
      );

    const paramName = params.discriminator
      .toLowerCase()
      .replace("params", " parameters");
    console.log(`Loading ${paramName}`);
    return params as IData.IDataInterfaces[T];
  }
  /**
   * Salva um preset
   * @param presetName O nome do preset
   */
  public savePreset(presetName: string, overwrite?: boolean): void {
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
  public setPreset(presetName: string) {
    const preset = this.presetMap.get(presetName); // Busca o preset no mapa
    if (!preset) throw new Error(`Preset ${presetName} not found`); // Lança excessão se o preset não existir
    this.preset = preset; // Atribui o preset ao preset atual
  }
  /**
   * Getter para os nomes dos presets
   * @returns Array contendo os nomes dos presets
   */
  public getPresetNames() {
    return [...this.presetMap.keys()];
  }
  /**
   * Define o mapa de preset
   * (adiciona o preset padrão ao mapa passado como parâmetro)
   * @param map Mapa de presets
   */
  public setPresetMap(map: PresetMap) {
    this.presetMap = map;
    this.presetMap.set("Default", this.defaultPreset);
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
    const map: PresetMap = new Map(!presetNames ? this.presetMap : []);

    // Adiciona ao mapa os presets especificados se definidos
    presetNames?.forEach((name) => {
      const preset = this.presetMap.get(name);
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
