import { useEffect, useState } from "react";
import { ToastAlert } from "../../../../his-utils/utils/commonFunction";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";

export default function DragDropComponent({
  mainContainerName,
  mainContainerData,
  firstChildName,
  secondChildName,
  allowMultiples,
  onChange,
  title,
}) {
  const [items, setItems] = useState(mainContainerData);
  const [childData, setChildData] = useState([]);
  const [secondChildData, setSecondChildData] = useState([]);

  useEffect(() => {
    if (mainContainerData) {
      setItems(mainContainerData);
    }
  }, [mainContainerData]);

  function onDragEnd(result) {
    if (!result.destination) return;

    const { source, destination } = result;

    // Prevent dragging to the same place
    //prettier-ignore
    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return;
    }

    // Restriction: Prevent adding more than 1 item in X-axis (left)
    if (
      !allowMultiples &&
      destination.droppableId === "left" &&
      childData.length >= 1
    ) {
      ToastAlert(`${firstChildName} can only have one item.`, "error");
      return;
    }

    // Move inside the same list
    if (source.droppableId === destination.droppableId) {
      const listCopy = [...getList(source.droppableId)];
      const [movedItem] = listCopy.splice(source.index, 1);
      listCopy.splice(destination.index, 0, movedItem);

      setList(source.droppableId, listCopy);
      return;
    }

    // Move between lists
    const sourceList = [...getList(source.droppableId)];
    const destList = [...getList(destination.droppableId)];

    const [movedItem] = sourceList.splice(source.index, 1);
    destList.splice(destination.index, 0, movedItem);

    setList(source.droppableId, sourceList);
    setList(destination.droppableId, destList);
  }

  function getList(id) {
    if (id === "central") return items;
    if (id === "left") return childData;
    if (id === "right") return secondChildData;
  }

  function setList(id, newList) {
    if (id === "central") {
      setItems(newList);
      if (onChange) onChange({ childData, secondChildData }); // Inform parent
    }
    if (id === "left") {
      setChildData(newList);
      if (onChange) onChange({ childData: newList, secondChildData });
    }
    if (id === "right") {
      setSecondChildData(newList);
      if (onChange) onChange({ childData, secondChildData: newList });
    }
  }

  const renderDroppableZone = (zone, zoneItems) => (
    <Droppable droppableId={zone}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={`droppable-zone ${
            snapshot.isDraggingOver ? "dragging-over" : ""
          }`}
        >
          {zoneItems.length === 0 ? (
            <div className="empty-placeholder">Drop here</div>
          ) : (
            zoneItems.map((item, index) => (
              <Draggable key={item} draggableId={item} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`draggable-item ${
                      snapshot.isDragging ? "dragging" : ""
                    }`}
                  >
                    {item}
                  </div>
                )}
              </Draggable>
            ))
          )}

          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="ChartMaker__container">
        <h4 className="ChartMaker__container-title">{title}</h4>
        <div className="ChartMaker__container-grid">
          <div className="ChartMaker__container-grid-item central">
            <h5 className="zone-title">{mainContainerName}</h5>
            <div className="zone-divider-line"></div>
            {renderDroppableZone("central", items)}
          </div>

          <div className="ChartMaker__container-grid-item left">
            <h5 className="zone-title">{firstChildName}</h5>
            <div className="zone-divider-line"></div>
            {renderDroppableZone("left", childData)}
          </div>

          <div className="ChartMaker__container-grid-item right">
            <h5 className="zone-title">{secondChildName}</h5>
            <div className="zone-divider-line"></div>
            {renderDroppableZone("right", secondChildData)}
          </div>
        </div>
      </div>
    </DragDropContext>
  );
}
