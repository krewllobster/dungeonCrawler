export const level = (w, h) => ({
  size: [w, h],
  rooms: {
    initial: {
      min_size: [3,3],
      max_size: [6,6],
      max_exits: 4
    },
    any: {
      min_size: [5,5],
      max_size: [15,15],
      max_exits: 6
    }
  },
  max_corridor_length: 10,
  min_corridor_length: 0,
  corridor_density: 0.8,
  symmetric_rooms: false,
  interconnects: 5,
  max_interconnect_length: 20,
  room_count: 20
})
