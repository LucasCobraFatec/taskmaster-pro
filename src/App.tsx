import { useState } from 'react'
import { mockTasks } from './data/mockTask'
import { Box, Card, Stack, Text, Button, Input, Flex } from '@chakra-ui/react'
import type { Task } from './types/Task'

function App() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  
  const addTask = () => {
    if (newTaskTitle.trim() === "") return;

    const newTask: Task = {
      id: Math.random().toString(),
      title: newTaskTitle,
      status: 'pendente' 
    };

    setTasks([...tasks, newTask]);
    setNewTaskTitle('');
  }; 

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id 
        ? { ...task, status: task.status === 'concluída' ? 'pendente' : 'concluída' } 
        : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  return (
    <Box padding="8" bg="gray.50" minHeight="100vh">
      <Stack gap="6" maxWidth="400px" margin="0 auto">
        
        <Text fontSize="2xl" fontWeight="bold" textAlign="center">Meu TaskMaster</Text>

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
          {tasks.map(task => (
            <Card.Root key={task.id} width="100%">
              <Card.Body>
                <Card.Title textDecoration={task.status === 'concluída' ? 'line-through' : 'none'}>
                  {task.title}
                </Card.Title>
                
                {}
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
          ))}
        </Stack>
      </Stack>
    </Box>
  );
}

export default App;