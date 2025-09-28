import Soundcloudwidget from "../components/Soundcloudwidget";
import DraggableWidgetContainer from "../components/DraggableWidgetContainer";
export default function  Work () {
  return(
<section>
    <header className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Work Area</h1>
        <p className="mt-1 text-sm text-gray-600">Organize your tasks and goals here.</p>
      </header>
    <div className="grid gap-6">
        <DraggableWidgetContainer>
         
          <DraggableSoundCloudWidget />
        </DraggableWidgetContainer>
      </div>
    </section>
  );
}
