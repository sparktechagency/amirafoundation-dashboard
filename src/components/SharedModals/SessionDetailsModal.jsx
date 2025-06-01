import { useGetSingleSessionSlotsQuery } from '@/redux/api/sessionApi';
import { Modal } from 'antd';
import Image from 'next/image';
import { RiCloseLargeLine } from 'react-icons/ri';

const SessionDetailsModal = ({ open, setOpen, session }) => {
  const id = session?.id;

  // Get sessionSlot API handler
  const { data, isError, isLoading } = useGetSingleSessionSlotsQuery(id, {
    skip: !id,
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading session details.</div>;
  if (!data?.data) return <div>No session data available.</div>;

  // Grouping sessions by date
  const groupedSessions = Array.isArray(data.data)
    ? data.data.reduce((acc, session) => {
        const sessionDate = session.date || 'Unknown Date';
        if (!acc[sessionDate]) {
          acc[sessionDate] = [];
        }
        acc[sessionDate].push(session);
        return acc;
      }, {})
    : {};

  return (
    <Modal
      open={open}
      footer={null}
      centered={true}
      onCancel={() => setOpen(false)}
      closeIcon={false}
      style={{
        minWidth: '900px',
        position: 'relative',
      }}
    >
      {/* Rest of your JSX remains unchanged */}
      <div className="p-10">
        <div className="flex gap-10">
          <div className="flex-1">
            <div className="w-full">
              <Image
                src={session?.thumbnail}
                alt="Session Thumbnail"
                width={400}
                height={300}
                className="h-[200px] w-full object-cover"
              />
            </div>
            <div className="w-full p-6 md:w-2/3">
              <h2 className="mb-2 text-2xl font-semibold">Session Details</h2>
              <h3 className="mb-4 text-lg text-gray-600">Find Balance & Clarity</h3>
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-600">About Therapy Session</h4>
                <p className="text-gray-800">{session?.des}</p>
              </div>
            </div>
          </div>
          <div className="flex-1">
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-600">Time Slots</h4>
              {Object.keys(groupedSessions).map((date) => (
                <div key={date}>
                  <h2 className="font-bold">Sessions on {date}</h2>
                  <ul className="list-none space-y-2 text-gray-800">
                    {groupedSessions[date].map((session) => (
                      <li key={session._id}>
                        {session.startTime} - {session.endTime}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-600">Location</h4>
              <p className="text-gray-800">{session?.location}</p>
            </div>
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-600">Per Session Fee</h4>
              <p className="text-xl font-semibold text-gray-900">{session?.fee}</p>
            </div>
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-600">Therapy Type</h4>
              <p className="text-gray-800">{session?.therapyType}</p>
            </div>
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-600">Therapist</h4>
              <p className="text-gray-800">{session?.therapist}</p>
            </div>
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-600">About Therapist</h4>
              <p className="text-gray-800">{session?.bio}</p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-600">Therapist Certificates</h4>
              <p>{session?.achievement}</p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default SessionDetailsModal;
