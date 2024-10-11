// Interface para os exercícios
interface ExerciseProps {
  nome: string;
  descricao: string;
  repeticoes?: string[];
  tempo?: string[];
}

// Interface para as refeições
interface RefeicoesProps {
  horario: string;
  nome: string;
  alimentos: string[];
}

// Atualizando a interface Data para incluir os exercícios
export interface Data {
  nome: string;
  sexo: string;
  idade: number;
  altura: number;
  peso: number;
  objetivo: string;
  refeicoes: RefeicoesProps[];
  suplementos: string[];
  exercicios: ExerciseProps[];
}
