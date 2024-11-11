import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { BarChart, LineChart } from 'react-native-gifted-charts';

export default function App() {
  const [data, setData] = useState([]);
  const [averageTemp, setAverageTemp] = useState(0);
  const [medianTemp, setMedianTemp] = useState(0);
  const [averageHumidity, setAverageHumidity] = useState(0);
  const [medianHumidity, setMedianHumidity] = useState(0);

  const getAPI = async () => {
    try {
      const url = 'http://localhost:5000/readings';
      let response = await fetch(url);
      let result = await response.json();
      console.log(result);
      setData(result || []);
      
      if (result.length > 0) {
        calculateStats(result);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const calculateStats = (data) => {
    const temperatures = data.map(item => item.temperature);
    const humidities = data.map(item => item.humidity);

    setAverageTemp(calculateAverage(temperatures));
    setMedianTemp(calculateMedian(temperatures));
    setAverageHumidity(calculateAverage(humidities));
    setMedianHumidity(calculateMedian(humidities));
  };

  const calculateAverage = (array) => {
    const sum = array.reduce((acc, value) => acc + value, 0);
    return (sum / array.length).toFixed(2);
  };

  const calculateMedian = (array) => {
    const sorted = array.slice().sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return (sorted.length % 2 !== 0 ? sorted[mid] : ((sorted[mid - 1] + sorted[mid]) / 2)).toFixed(2);
  };

  useEffect(() => {
    getAPI();
  }, []);

  return (
    <View style={styles.container}>
      {data.length > 0 ? (
        <>
          <Text style={styles.text}>Average Temperature: {averageTemp}°C</Text>
          <Text style={styles.text}>Median Temperature: {medianTemp}°C</Text>
          <Text style={styles.text}>Average Humidity: {averageHumidity}%</Text>
          <Text style={styles.text}>Median Humidity: {medianHumidity}%</Text>

          <Text style={styles.title}>Temperature Over Time</Text>
          <LineChart
            data={data.map((item, index) => ({
              value: item.temperature,
              label: `T${index + 1}`
            }))}
            height={200}
            initialSpacing={10}
            color="tomato"
            lineThickness={2}
            hideDataPoints
            spacing={20}
          />

          <Text style={styles.title}>Humidity Over Time</Text>
          <LineChart
            data={data.map((item, index) => ({
              value: item.humidity,
              label: `H${index + 1}`
            }))}
            height={200}
            initialSpacing={10}
            color="deepskyblue"
            lineThickness={2}
            hideDataPoints
            spacing={20}
          />

          <Text style={styles.title}>MQ Sensor Value</Text>
          <BarChart
            data={data.map((item) => ({
              value: item.mq_sensor_value,
              label: 'MQ'
            }))}
            barWidth={30}
            spacing={20}
            height={200}
            initialSpacing={10}
            frontColor="orange"
            barBorderRadius={5}
          />
        </>
      ) : (
        <View>
          <Text>No data available</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 16,
    marginVertical: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 8,
  },
});
