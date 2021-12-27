export interface Command {
    parameters: CommandParameters;
    pipelines: PipelineName[];
}

export type PipelineName = string;

export type ParameterType = "string" | "number" | "boolean";

export interface CommandParameters {
    name: string;
    description?: string;
    type: ParameterType;
    default?: any;
    environment?: string;
}
