import { View, Text, StyleSheet, Pressable, ScrollView, Share } from 'react-native';
import { useDataStore } from '../../store/data';
import { api } from '../../services/api';
import { useQuery } from '@tanstack/react-query';
import { colors } from '../../constants/colors';
import { Data } from '../../types/data';
import { Link, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface ResponseData {
  data: Data;
}

export default function Exercise() {
  const user = useDataStore(state => state.user);

  const { data, isFetching, error } = useQuery({
    queryKey: ["exercise"],
    queryFn: async () => {
      try {
        if (!user) {
          throw new Error("User data is missing");
        }

        const response = await api.post<ResponseData>("/exercise", {
          name: user.name,
          age: user.age,
          gender: user.gender,
          height: user.height,
          weight: user.weight,
          objective: user.objective,
          level: user.level
        });

        return response.data.data;
      } catch (err) {
        console.log(err);
      }
    }
  });

  async function handleShare() {
    try {
      if (data && Object.keys(data).length === 0) return;

      const exercises = data?.exercicios.map(
        item => `\n- Nome: ${item.nome}\n- Descrição: ${item.descricao}\n- Repetições: ${item.repeticoes?.join(', ')}` 
      ).join('\n');

      const message = `Exercícios: ${data?.nome} - Objetivo: ${data?.objetivo}\n\n${exercises}`;

      await Share.share({
        message: message
      });
    } catch (err) {
      console.log(err);
    }
  }

  if (isFetching) {
    return (
      <View style={styles.loading}>
        <Text style={styles.loadingText}>Estamos gerando seus exercícios!</Text>
        <Text style={styles.loadingText}>Consultando IA...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.loading}>
        <Text style={styles.loadingText}>Falha ao gerar seus exercícios!</Text>
        <Link href="/">
          <Text style={styles.loadingText}>Tente novamente</Text>
        </Link>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.containerHeader}>
        <View style={styles.contentHeader}>
          <Text style={styles.title}>Meus Exercícios</Text>

          <Pressable style={styles.buttonShare} onPress={handleShare}>
            <Text style={styles.buttonShareText}>Compartilhar</Text>
          </Pressable>
        </View>
      </View>

      <View style={{ paddingLeft: 16, paddingRight: 16, flex: 1 }}>
        {data && Object.keys(data).length > 0 && (
          <>
            <Text style={styles.label}>Exercícios:</Text>
            <ScrollView>
              <View style={styles.exercises}>
                {data.exercicios.map((exercicio) => (
                  <View key={exercicio.nome} style={styles.exercise}>
                    <View style={styles.exerciseHeader}>
                      <Text style={styles.exerciseName}>{exercicio.nome}</Text>
                      <Ionicons name="fitness" size={16} color="#000" />
                    </View>

                    <Text>Descrição: {exercicio.descricao}</Text>
                    {exercicio.repeticoes && (
                      <Text>Repetições: {exercicio.repeticoes.join(', ')}</Text>
                    )}
                    {exercicio.tempo && (
                      <Text>Tempo: {exercicio.tempo} minutos</Text>
                    )}
                  </View>
                ))}
              </View>

              <Pressable style={styles.button} onPress={() => router.replace("/")}>
                <Text style={styles.buttonText}>Gerar novos exercícios</Text>
              </Pressable>
            </ScrollView>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center'
  },
  loadingText: {
    fontSize: 18,
    color: colors.white,
    marginBottom: 4,
  },
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  containerHeader: {
    backgroundColor: colors.white,
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
    paddingTop: 60,
    paddingBottom: 20,
    marginBottom: 16,
  },
  contentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 16,
    paddingRight: 16
  },
  title: {
    fontSize: 28,
    color: colors.background,
    fontWeight: 'bold'
  },
  buttonShare: {
    backgroundColor: colors.blue,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    borderRadius: 4
  },
  buttonShareText: {
    color: colors.white,
    fontWeight: '500'
  },
  label: {
    color: "#FFF",
    marginTop: 16,
    fontWeight: 'bold',
    fontSize: 18
  },
  exercises: {
    backgroundColor: colors.white,
    marginTop: 14,
    padding: 14,
    borderRadius: 8
  },
  exercise: {
    backgroundColor: 'rgba(208, 208, 208, 0.40)',
    padding: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  exerciseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  button: {
    backgroundColor: colors.blue,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 20,
    marginTop: 20
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold'
  }
});
