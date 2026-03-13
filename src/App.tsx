import { useState, useEffect } from "react";
import { mockTasks } from "./data/mockTask";
import {
  Box,
  Card,
  Stack,
  Text,
  Button,
  Input,
  Flex,
  Progress,
} from "@chakra-ui/react";
import type { Task } from "./types/Task";

function App() {
  const [newTaskTitle, setNewTaskTitle] = useState("");

  const [filter, setFilter] = useState<"todas" | "pendentes" | "concluídas">(
    "todas",
  );

  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem("taskmaster-tasks");
    return savedTasks ? JSON.parse(savedTasks) : mockTasks;
  });

  useEffect(() => {
    localStorage.setItem("taskmaster-tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (newTaskTitle.trim() === "") return;
    const newTask: Task = {
      id: Math.random().toString(),
      title: newTaskTitle,
      status: "pendente",
    };
    setTasks([...tasks, newTask]);
    setNewTaskTitle("");
  };

  const toggleTask = (id: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id
          ? {
              ...task,
              status: task.status === "concluída" ? "pendente" : "concluída",
            }
          : task,
      ),
    );
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "concluída").length;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const filteredTasks = tasks.filter((task) => {
    if (filter === "pendentes") return task.status === "pendente";
    if (filter === "concluídas") return task.status === "concluída";
    return true;
  });

 return (
    <Box padding="8" bg="gray.50" minHeight="100vh">
     
      <Stack gap="6" maxWidth="400px" margin="0 auto">
        
        <Stack gap="2">
          <Text fontSize="2xl" fontWeight="bold" textAlign="center">Meu TaskMaster</Text>
          
          <Box width="100%" px="2">
            <Flex justifyContent="space-between" mb="1">
              <Text fontSize="xs" fontWeight="medium">Progresso</Text>
              <Text fontSize="xs" fontWeight="bold">{Math.round(progress)}%</Text>
            </Flex>
            <Progress.Root value={progress} colorPalette="blue" variant="subtle" shape="rounded">
              <Progress.Track>
                <Progress.Range />
              </Progress.Track>
            </Progress.Root>
          </Box>
        </Stack>

        <Flex gap="2" justifyContent="center">
          <Button 
            size="xs" 
            variant={filter === 'todas' ? 'solid' : 'ghost'} 
            onClick={() => setFilter('todas')}
          >
            Todas
          </Button>
          <Button 
            size="xs" 
            variant={filter === 'pendentes' ? 'solid' : 'ghost'} 
            onClick={() => setFilter('pendentes')}
          >
            Pendentes
          </Button>
          <Button 
            size="xs" 
            variant={filter === 'concluídas' ? 'solid' : 'ghost'} 
            onClick={() => setFilter('concluídas')}
          >
            Concluídas
          </Button>
        </Flex>

       
        <Flex gap="2">
          <Input 
            placeholder="O que precisa ser feito?" 
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            bg="white"
          />
          <Button colorPalette="blue" onClick={addTask}>
            Adicionar
          </Button>
        </Flex>

       
        <Stack gap="4">
          {filteredTasks.length === 0 ? (
            <Box textAlign="center" py="10" px="6" border="2px dashed" borderColor="gray.200" borderRadius="md">
              <Text color="gray.500">Nenhuma tarefa encontrada. ✨</Text>
            </Box>
          ) : (
            filteredTasks.map(task => (
              <Card.Root key={task.id} width="100%">
                <Card.Body>
                  <Card.Title textDecoration={task.status === 'concluída' ? 'line-through' : 'none'}>
                    {task.title}
                  </Card.Title>
                  
                  <Text 
                    colorPalette={task.status === 'concluída' ? 'green' : 'red'} 
                    color="colorPalette.600" 
                    mb="4"
                  >
                    Status: {task.status}
                  </Text>

                  <Flex gap="2">
                    <Button 
                      size="sm" 
                      variant={task.status === 'concluída' ? 'outline' : 'solid'}
                      colorPalette="blue"
                      onClick={() => toggleTask(task.id)}
                    >
                      {task.status === 'concluída' ? 'Desfazer' : 'Concluir'}
                    </Button>

                    <Button 
                      size="sm" 
                      variant="ghost" 
                      colorPalette="red" 
                      onClick={() => deleteTask(task.id)}
                    >
                      Excluir
                    </Button>
                  </Flex>
                </Card.Body>
              </Card.Root>
            ))
          )}
        </Stack>
      </Stack>
    </Box>
  );
}

export default App;
