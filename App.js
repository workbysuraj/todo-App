import { View, Text, SafeAreaView, TouchableOpacity, KeyboardAvoidingView, TextInput, Keyboard, ScrollView, Platform, Animated } from 'react-native';
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import Task from './Task';

export default function App() {
  const [task, setTask] = useState('');
  const [taskItems, setTaskItems] = useState([]);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [inputOffset] = useState(new Animated.Value(0)); // Animated value for moving the input

  // Handle task completion (remove task)
  const completeTask = (index) => {
    let itemsCopy = [...taskItems];
    itemsCopy.splice(index, 1);
    setTaskItems(itemsCopy);
    saveTasks(itemsCopy);  // Save updated tasks to AsyncStorage
  };

  // Handle adding a new task
  const handleAddTask = () => {
    if (task.trim()) {  // Prevent adding empty tasks
      Keyboard.dismiss();
      const newTaskItems = [...taskItems, task];
      setTaskItems(newTaskItems);
      saveTasks(newTaskItems);  // Save new tasks to AsyncStorage
      setTask('');
    }
  };

  // Save tasks to AsyncStorage
  const saveTasks = async (tasks) => {
    try {
      await AsyncStorage.setItem('tasks', JSON.stringify(tasks)); // Store tasks in AsyncStorage
    } catch (error) {
      console.error('Error saving tasks:', error);
    }
  };

  // Load tasks from AsyncStorage
  const loadTasks = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem('tasks');
      if (storedTasks) {
        setTaskItems(JSON.parse(storedTasks));  // Set tasks to the loaded ones
      }
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  };

  // Load tasks when the app starts
  useEffect(() => {
    loadTasks();

    // Listen for keyboard events
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
      Animated.timing(inputOffset, {
        toValue: -30, // Moves up by 20px
        duration: 200,
        useNativeDriver: true,
      }).start();
    });

    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
      Animated.timing(inputOffset, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });

    // Cleanup listeners on component unmount
    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, padding: 4, backgroundColor: "white" }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Scrollable Content */}
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 30, fontWeight: 'bold', marginBottom: 20, paddingLeft: 10 }}>
            Today's Tasks
          </Text>

          <ScrollView style={{ paddingLeft: 10 }}>
            {/* Task List */}
            {taskItems.map((item, index) => (
              <TouchableOpacity key={index} onPress={() => completeTask(index)}>
                <Task text={item} />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Input Section */}
        <Animated.View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 10,
            backgroundColor: 'white',
            borderTopWidth: 1,
            borderTopColor: '#ddd',
            marginBottom: Platform.OS === 'ios' ? 20 : 0, // Adjust spacing on iOS
            transform: [{ translateY: inputOffset }] // Apply the animated offset to move the input field
          }}
        >
          <TextInput
            placeholder="Write a task"
            style={{
              borderWidth: 1,
              borderColor: 'black',
              width: '80%',
              borderRadius: 10,
              padding: 10,
            }}
            value={task}
            onChangeText={setTask}
          />
          <TouchableOpacity
            style={{
              borderRadius: 50,
              borderWidth: 1,
              padding: 10,
              height: 45,
              width: 45,
              borderColor: 'black',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={handleAddTask}
          >
            <Text style={{ fontSize: 30, textAlign: 'center', justifyContent: "center" }}>+</Text>
          </TouchableOpacity>
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
