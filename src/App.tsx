import { useState } from 'react'
import { mockTasks } from './data/mockTask'
import {Box, Card,Stack,Text} from '@chakra-ui/react'


function App() {

const [tasks, setTasks] = useState(mockTasks);




return(
  <Stack gap="4" padding="4">
    {tasks.map(task =>
    <Card.Root key={task.id} width="320px">
    <Card.Body>
      <Card.Title>{task.title}</Card.Title>
      <Text>{task.status}</Text>
    </Card.Body>
     </Card.Root> 
      
      )}
      </Stack>
  
);

}

export default App
