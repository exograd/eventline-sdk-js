export interface Pipeline {
  concurrent: boolean;
  tasks: PipelineTask[];
}

export interface PipelineTask {
  name?: string;
  label?: string;
  task: string;
  parameters?: object;
  dependencies?: string[];
  on_failure?: "abort" | "continue";
  nb_instances?: number;
  nb_retries?: number;
  retry_delay?: number;
}
