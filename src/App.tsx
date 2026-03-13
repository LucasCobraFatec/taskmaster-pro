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
import {
  LuPlus,
  LuPencil,
  LuTrash2,
  LuCheck,
  LuUndo2,
  LuSave,
  LuX,
} from "react-icons/lu";

function App() {
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [filter, setFilter] = useState<"todas" | "pendentes" | "concluídas">(
    "todas",
  );
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [editingDescription, setEditingDescription] = useState("");

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
      description: newTaskDescription,
      status: "pendente",
    };
    setTasks([...tasks, newTask]);
    setNewTaskTitle("");
    setNewTaskDescription("");
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

  const startEditing = (task: Task) => {
    setEditingTaskId(task.id);
    setEditingTitle(task.title);
    setEditingDescription(task.description || "");
  };

  const saveEdit = (id: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id
          ? { ...task, title: editingTitle, description: editingDescription }
          : task,
      ),
    );
    setEditingTaskId(null);
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
    <Box
      padding="8"
      bgGradient="to-br"
      gradientFrom="blue.50"
      gradientTo="purple.50"
      minHeight="100vh"
      color="gray.800"
    >
      <Stack gap="6" maxWidth="450px" margin="0 auto">
        <Stack gap="2" textAlign="center">
          <Text
            fontSize="4xl"
            fontWeight="black"
            letterSpacing="tight"
            bgGradient="to-r"
            gradientFrom="blue.600"
            gradientTo="purple.600"
            bgClip="text"
          >
            TaskMaster Pro
          </Text>

          <Box width="100%" px="2">
            <Flex justifyContent="space-between" mb="1">
              <Text fontSize="xs" fontWeight="bold" color="gray.500">
                PROGRESSO GERAL
              </Text>
              <Text fontSize="xs" fontWeight="bold" color="blue.600">
                {Math.round(progress)}%
              </Text>
            </Flex>
            <Progress.Root
              value={progress}
              colorPalette="blue"
              size="sm"
              shape="rounded"
              shadow="sm"
            >
              <Progress.Track bg="white">
                <Progress.Range />
              </Progress.Track>
            </Progress.Root>
          </Box>
        </Stack>

        <Flex
          gap="1"
          justifyContent="center"
          bg="white/60"
          p="1"
          borderRadius="full"
          shadow="sm"
        >
          {(["todas", "pendentes", "concluídas"] as const).map((f) => (
            <Button
              key={f}
              size="xs"
              variant={filter === f ? "solid" : "ghost"}
              colorPalette="blue"
              borderRadius="full"
              flex="1"
              onClick={() => setFilter(f)}
              textTransform="capitalize"
            >
              {f}
            </Button>
          ))}
        </Flex>

        <Stack gap="2" bg="white" p="4" borderRadius="2xl" shadow="md">
          <Input
            placeholder="Título da tarefa..."
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            variant="flushed"
            fontWeight="bold"
            border="none"
          />
          <Input
            placeholder="Descrição da tarefa..."
            value={newTaskDescription}
            onChange={(e) => setNewTaskDescription(e.target.value)}
            variant="flushed"
            fontSize="sm"
            border="none"
          />
          <Button
            colorPalette="blue"
            onClick={addTask}
            borderRadius="xl"
            mt="2"
          >
            <LuPlus /> Adicionar Tarefa
          </Button>
        </Stack>

        <Stack gap="4">
          {filteredTasks.length === 0 ? (
            <Box
              textAlign="center"
              py="16"
              bg="white/40"
              borderRadius="2xl"
              border="2px dashed"
              borderColor="gray.300"
            >
              <Text color="gray.500" fontWeight="medium">
                Nenhuma tarefa encontrada. ✨
              </Text>
            </Box>
          ) : (
            filteredTasks.map((task) => (
              <Card.Root
                key={task.id}
                width="100%"
                bg="white"
                borderLeft="4px solid"
                borderColor={
                  task.status === "concluída" ? "green.400" : "orange.400"
                }
                shadow="sm"
                _hover={{ shadow: "md", transform: "translateY(-2px)" }}
                transition="all 0.2s"
              >
                <Card.Body p="4">
                  {editingTaskId === task.id ? (
                    <Stack gap="3">
                      <Input
                        size="sm"
                        value={editingTitle}
                        onChange={(e) => setEditingTitle(e.target.value)}
                        bg="gray.50"
                        autoFocus
                      />
                      <Input
                        size="sm"
                        value={editingDescription}
                        onChange={(e) => setEditingDescription(e.target.value)}
                        bg="gray.50"
                        placeholder="Editar descrição..."
                      />
                      <Flex gap="2">
                        <Button
                          size="sm"
                          colorPalette="green"
                          flex="1"
                          onClick={() => saveEdit(task.id)}
                        >
                          <LuSave /> Salvar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          flex="1"
                          onClick={() => setEditingTaskId(null)}
                        >
                          <LuX /> Cancelar
                        </Button>
                      </Flex>
                    </Stack>
                  ) : (
                    <>
                      <Card.Title
                        fontSize="md"
                        color={
                          task.status === "concluída" ? "gray.400" : "gray.800"
                        }
                        textDecoration={
                          task.status === "concluída" ? "line-through" : "none"
                        }
                      >
                        {task.title}
                      </Card.Title>

                      {task.description && (
                        <Text fontSize="xs" color="gray.500" mt="1">
                          {task.description}
                        </Text>
                      )}

                      <Flex
                        justifyContent="space-between"
                        alignItems="center"
                        mt="4"
                      >
                        <Flex gap="2">
                          <Button
                            size="sm"
                            variant={
                              task.status === "concluída" ? "outline" : "solid"
                            }
                            colorPalette={
                              task.status === "concluída" ? "gray" : "green"
                            }
                            onClick={() => toggleTask(task.id)}
                            borderRadius="lg"
                          >
                            {task.status === "concluída" ? (
                              <LuUndo2 />
                            ) : (
                              <LuCheck />
                            )}
                            <Text fontSize="xs">
                              {task.status === "concluída"
                                ? "Desfazer"
                                : "Concluir"}
                            </Text>
                          </Button>

                          <Button
                            size="sm"
                            variant="ghost"
                            colorPalette="blue"
                            onClick={() => startEditing(task)}
                          >
                            <LuPencil />
                          </Button>
                        </Flex>

                        <Button
                          size="sm"
                          variant="ghost"
                          colorPalette="red"
                          onClick={() => deleteTask(task.id)}
                        >
                          <LuTrash2 />
                        </Button>
                      </Flex>
                    </>
                  )}
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
