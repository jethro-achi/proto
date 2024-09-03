import React, { useState, useEffect } from 'react';
import { AudienceProfile } from 'components/apiKey/types'; // Adjust the import path as necessary
import { Tabs, Tab, Card, CardBody, Progress } from '@nextui-org/react';

const AIPrompt: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState<AudienceProfile[]>([]);
  const [typing, setTyping] = useState(false);
  const [audienceProfiles, setAudienceProfiles] = useState<AudienceProfile[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [isLoadingComplete, setIsLoadingComplete] = useState<boolean>(false);
  const [, setFadeOut] = useState<boolean>(false);

  useEffect(() => {
    const loadAudienceProfiles = async () => {
      try {
        const res = await fetch('https://x8ki-letl-twmt.n7.xano.io/api:KpVdnEgh/get_audience_profiles');
        if (!res.ok) {
          throw new Error(`Failed to fetch audience profiles: ${res.status} ${res.statusText}`);
        }
        const data: AudienceProfile[] = await res.json();
        setAudienceProfiles(data);
      } catch (error) {
        console.error('Error loading audience profiles:', error);
        setError((error as Error).message);
      }
    };

    loadAudienceProfiles();
  }, []);

  const handlePromptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrompt(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setTyping(true);
    setIsLoadingComplete(false);
    setFadeOut(false);

    const statusMessages = [
      'Processing your Prompt',
      'Finding a Match',
      'Checking Accuracy',
      'Almost Done!',
      'Finalizing Result'
    ];

    let progressValue = 0;
    let statusIndex = 0;

    const updateStatus = () => {
      if (statusIndex < statusMessages.length) {
        setFadeOut(true);
        setTimeout(() => {
          setStatusMessage(statusMessages[statusIndex]);
          setFadeOut(false);
          statusIndex++;
          setTimeout(updateStatus, 3000); // Wait 3 seconds before next update
        }, 500); // Wait for fade out
      } else {
        setIsLoadingComplete(true);
        finishLoading();
      }
    };

    const updateProgress = () => {
      if (progressValue < 100) {
        progressValue += 1;
        setProgress(progressValue);
        setTimeout(updateProgress, 100);
      }
    };

    updateStatus();
    updateProgress();

    const finishLoading = () => {
      setProgress(100);

      const matchingProfiles = audienceProfiles.filter(profile =>
        profile.Name.toLowerCase().includes(prompt.toLowerCase()) ||
        profile.Audience_Profiles.toLowerCase().includes(prompt.toLowerCase()) ||
        profile.Key_Actions.toLowerCase().includes(prompt.toLowerCase()) ||
        profile.Interventions.toLowerCase().includes(prompt.toLowerCase()) ||
        profile.Channels.toLowerCase().includes(prompt.toLowerCase()) ||
        profile.Tools.toLowerCase().includes(prompt.toLowerCase())
      );

      setResponse(matchingProfiles);
      setTyping(false);
    };
  };

  return (
    <div className="ai-prompt-ui p-4 bg-white text-black border border-black">
      {error && (
        <div className="error-message mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          id="prompt"
          value={prompt}
          onChange={handlePromptChange}
          className="w-full px-4 py-2 mb-4 bg-white text-black border border-black focus:ring-0 focus:border-black focus:bg-white"
          placeholder="Search Audience Profile Here..."
          required
        />
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium bg-black text-white border border-black hover:bg-gray-800"
        >
          {'Submit'}
        </button>
      </form>
      {typing && (
        <div className="mt-4 p-4 bg-white text-black border border-black">
          <div className="relative pt-1 w-full">
            <Progress
              size="sm"
              radius="sm"
              classNames={{
                base: "w-full",
                track: "drop-shadow-md border border-default",
                indicator: "bg-gradient-to-r from-pink-500 to-yellow-500",
                label: "tracking-wider font-light text-default-300",
                value: "text-foreground/60",
              }}
              label={statusMessage}
              value={progress}
              showValueLabel={true}
            />
          </div>
        </div>
      )}
      {isLoadingComplete && response.length > 0 && (
        <div className="mt-4 p-4 text-black border border-black transition-opacity duration-500 ease-in-out">
          <Tabs aria-label="Audience Profiles">
            {response.map(profile => (
              <Tab key={profile.id} title={profile.Name} aria-label='Audience Profile'>
                <Card>
                  <CardBody>
                    <h3 className="text-lg font-semibold ">{'Audience Profile'}</h3>
                    <p>{profile.Audience_Profiles}</p>
                    <h3 className="text-lg font-semibold mt-4">{'Key Actions'}</h3>
                    <p>{profile.Key_Actions}</p>
                    <h3 className="text-lg font-semibold mt-4">{'Interventions'}</h3>
                    <p>{profile.Interventions}</p>
                    <h3 className="text-lg font-semibold mt-4">{'Channels'}</h3>
                    <p>{profile.Channels}</p>
                    <h3 className="text-lg font-semibold mt-4">{'Tools'}</h3>
                    <p>{profile.Tools}</p>
                  </CardBody>
                </Card>
              </Tab>
            ))}
          </Tabs>
        </div>
      )}
    </div>
  );
};

export default AIPrompt;
